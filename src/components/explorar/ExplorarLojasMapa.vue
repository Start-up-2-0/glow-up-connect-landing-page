<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { EstabelecimentoProximo } from '@/types/estabelecimento.types'
import { estabelecimentoTemCoordenadas } from '@/utils/explorarMapa'
import { formatDistanciaKm } from '@/utils/formatters'
import ExplorarLojasCard from './ExplorarLojasCard.vue'

const props = defineProps<{
  itens: EstabelecimentoProximo[]
  userLat?: number | null
  userLng?: number | null
  userAccuracy?: number | null
  selectedGuid?: string | null
  focusGuid?: string | null
  bootstrapLat: number
  bootstrapLng: number
  /** Full-bleed map experience (card bottom-right, no frame chrome). */
  immersive?: boolean
}>()

const emit = defineEmits<{
  'update:selectedGuid': [value: string | null]
  'bounds-change': [payload: { latitude: number; longitude: number }]
  'user-interact': []
}>()

const mapEl = ref<HTMLElement | null>(null)
const ready = ref(false)
const selectedItem = computed(
  () => props.itens.find((i) => i.publicGuid === props.selectedGuid) ?? null,
)

type LeafletNs = typeof import('leaflet')
type LeafletMap = import('leaflet').Map
type Marker = import('leaflet').Marker
type Circle = import('leaflet').Circle

let L: LeafletNs | null = null
let map: LeafletMap | null = null
// MarkerClusterGroup vem de leaflet.markercluster (augmentação em runtime).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cluster: any = null
let userMarker: Marker | null = null
let userAccuracyCircle: Circle | null = null
const markersByGuid = new Map<string, Marker>()
let moveTimer: ReturnType<typeof setTimeout> | null = null
let suppressTimer: ReturnType<typeof setTimeout> | null = null
let suppressBoundsEmit = false
let lastEmittedCenter: { lat: number; lng: number } | null = null
let userDragging = false

function withSuppressedBounds(action: () => void, ms = 800) {
  suppressBoundsEmit = true
  if (suppressTimer) clearTimeout(suppressTimer)
  action()
  suppressTimer = setTimeout(() => {
    suppressBoundsEmit = false
  }, ms)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function markerMetaBits(item: EstabelecimentoProximo): string[] {
  const bits: string[] = []
  if (typeof item.distanciaKm === 'number' && Number.isFinite(item.distanciaKm)) {
    bits.push(formatDistanciaKm(item.distanciaKm))
  }
  if (item.categoria?.trim()) bits.push(item.categoria.trim())
  if (typeof item.notaMedia === 'number' && Number.isFinite(item.notaMedia) && item.notaMedia > 0) {
    const nota = item.notaMedia.toFixed(1).replace('.', ',')
    const total =
      typeof item.totalAvaliacoes === 'number' && item.totalAvaliacoes > 0
        ? ` (${item.totalAvaliacoes})`
        : ''
    bits.push(`★ ${nota}${total}`)
  }
  const bairro = item.endereco?.bairro?.trim()
  if (bairro && bits.length < 3) bits.push(bairro)
  return bits
}

function markerHtml(
  item: EstabelecimentoProximo,
  state: 'default' | 'selected' | 'destaque',
) {
  const immersive = Boolean(props.immersive)
  const nome = item.nome || 'Estabelecimento'
  const label = escapeHtml(nome)
  const initial = escapeHtml(nome.charAt(0).toUpperCase())
  const logoSrc = item.logo?.trim()
  const avatar = logoSrc
    ? `<img class="explorar-landing-marker__logo" src="${escapeHtml(logoSrc)}" alt="" width="28" height="28" loading="lazy" decoding="async" />`
    : `<span class="explorar-landing-marker__initial">${initial}</span>`
  const metaBits = markerMetaBits(item)
  const metaHtml = metaBits.length
    ? `<span class="explorar-landing-dot__sub">${escapeHtml(metaBits.join(' · '))}</span>`
    : ''
  const ariaExtra = metaBits.length ? ` — ${metaBits.join(' · ')}` : ''

  if (immersive) {
    const classes = [
      'explorar-landing-dot',
      state === 'selected' ? 'explorar-landing-dot--selected' : '',
      state === 'destaque' || item.destaqueMarketplace ? 'explorar-landing-dot--destaque' : '',
    ]
      .filter(Boolean)
      .join(' ')
    return `<button type="button" class="${classes}" aria-label="${label}${escapeHtml(ariaExtra)}" title="${label}">
      <span class="explorar-landing-dot__core">${avatar}</span>
      <span class="explorar-landing-dot__meta">
        <span class="explorar-landing-dot__kind">Loja</span>
        <span class="explorar-landing-dot__name">${label}</span>
        ${metaHtml}
      </span>
    </button>`
  }

  const classes = [
    'explorar-landing-marker',
    state === 'selected' ? 'explorar-landing-marker--selected' : '',
    state === 'destaque' || item.destaqueMarketplace
      ? 'explorar-landing-marker--destaque'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  const sub =
    metaBits.length > 0
      ? `<span class="explorar-landing-marker__sub">${escapeHtml(metaBits.join(' · '))}</span>`
      : ''

  return `<button type="button" class="${classes}" aria-label="${label}${escapeHtml(ariaExtra)}">
    <span class="explorar-landing-marker__avatar">${avatar}</span>
    <span class="explorar-landing-marker__text">
      <span class="explorar-landing-marker__name">${label}</span>
      ${sub}
    </span>
  </button>`
}

function userMarkerHtml() {
  return `<div class="explorar-landing-you" role="img" aria-label="Você está aqui">
    <span class="explorar-landing-you__core" aria-hidden="true"></span>
    <span class="explorar-landing-you__meta">
      <span class="explorar-landing-you__label">Você</span>
      <span class="explorar-landing-you__sub">Sua localização</span>
    </span>
  </div>`
}

function markerIcon(item: EstabelecimentoProximo, selected: boolean) {
  if (!L) return undefined
  const state = selected ? 'selected' : item.destaqueMarketplace ? 'destaque' : 'default'
  return L.divIcon({
    className: 'explorar-landing-marker-wrap',
    html: markerHtml(item, state),
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

function syncMarkers() {
  if (!map || !cluster || !L) return

  cluster.clearLayers()
  markersByGuid.clear()

  const comCoords = props.itens.filter(estabelecimentoTemCoordenadas)
  for (const item of comCoords) {
    const selected = item.publicGuid === props.selectedGuid
    const marker = L.marker([item.latitude, item.longitude], {
      icon: markerIcon(item, selected),
      riseOnHover: true,
      title: item.nome,
    })
    marker.on('click', () => {
      emit('update:selectedGuid', item.publicGuid)
    })
    markersByGuid.set(item.publicGuid, marker)
    cluster.addLayer(marker)
  }
}

function clearUserLayers() {
  if (!map) return
  if (userMarker) {
    map.removeLayer(userMarker)
    userMarker = null
  }
  if (userAccuracyCircle) {
    map.removeLayer(userAccuracyCircle)
    userAccuracyCircle = null
  }
}

function syncUserMarker() {
  if (!map || !L) return
  if (props.userLat == null || props.userLng == null) {
    clearUserLayers()
    return
  }

  const latlng: [number, number] = [props.userLat, props.userLng]

  if (!userAccuracyCircle) {
    userAccuracyCircle = L.circle(latlng, {
      radius: Math.max(props.userAccuracy ?? 40, 20),
      color: '#c9a227',
      weight: 1,
      opacity: 0.4,
      fillColor: '#c9a227',
      fillOpacity: 0.1,
      interactive: false,
    }).addTo(map)
  } else {
    userAccuracyCircle.setLatLng(latlng)
    if (props.userAccuracy != null && props.userAccuracy > 0) {
      userAccuracyCircle.setRadius(Math.max(props.userAccuracy, 20))
    }
  }

  if (!userMarker) {
    userMarker = L.marker(latlng, {
      icon: L.divIcon({
        className: 'explorar-landing-marker-wrap',
        html: userMarkerHtml(),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      }),
      interactive: false,
      zIndexOffset: 1000,
    }).addTo(map)
  } else {
    userMarker.setLatLng(latlng)
  }
}

function fitToContent(force = false) {
  if (!map || !cluster) return

  if (props.userLat != null && props.userLng != null) {
    if (force) {
      withSuppressedBounds(() => {
        map?.setView([props.userLat!, props.userLng!], 14)
      })
    }
    return
  }

  const layers = cluster.getLayers()
  if (layers.length === 0) {
    if (force) {
      withSuppressedBounds(() => {
        map?.setView([props.bootstrapLat, props.bootstrapLng], 13)
      })
    }
    return
  }

  const bounds = cluster.getBounds()
  if (force || !map.getBounds().contains(bounds)) {
    withSuppressedBounds(() => {
      map?.fitBounds(bounds.pad(0.18), { maxZoom: 15, animate: true })
    })
  }
}

function focusEstabelecimento(guid: string) {
  const item = props.itens.find((i) => i.publicGuid === guid)
  if (!item || !estabelecimentoTemCoordenadas(item) || !map) return
  withSuppressedBounds(() => {
    map?.flyTo([item.latitude, item.longitude], Math.max(map.getZoom(), 15), {
      duration: 0.55,
    })
  }, 900)
  emit('update:selectedGuid', guid)
}

function onMoveEnd() {
  if (!map || suppressBoundsEmit) return
  if (userDragging) {
    emit('user-interact')
    userDragging = false
  }
  if (moveTimer) clearTimeout(moveTimer)
  moveTimer = setTimeout(() => {
    if (!map || suppressBoundsEmit) return
    const center = map.getCenter()
    if (
      lastEmittedCenter
      && Math.abs(lastEmittedCenter.lat - center.lat) < 0.002
      && Math.abs(lastEmittedCenter.lng - center.lng) < 0.002
    ) {
      return
    }
    lastEmittedCenter = { lat: center.lat, lng: center.lng }
    emit('bounds-change', { latitude: center.lat, longitude: center.lng })
  }, 450)
}

function onDragStart() {
  userDragging = true
}

onMounted(async () => {
  if (!mapEl.value || import.meta.env.SSR) return

  const leaflet = await import('leaflet')
  await import('leaflet.markercluster')
  await import('leaflet/dist/leaflet.css')
  await import('leaflet.markercluster/dist/MarkerCluster.css')
  await import('leaflet.markercluster/dist/MarkerCluster.Default.css')

  L = leaflet.default ?? leaflet

  const startLat = props.userLat ?? props.bootstrapLat
  const startLng = props.userLng ?? props.bootstrapLng

  map = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: true,
  }).setView([startLat, startLng], 13)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cluster = (L as any).markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 52,
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: 17,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iconCreateFunction(c: any) {
      const count = c.getChildCount()
      // Estilo PDX: círculos por densidade (teal → lime → gold)
      const size = count > 20 ? 'lg' : count > 8 ? 'md' : 'sm'
      const tone = count > 20 ? 'hot' : count > 8 ? 'warm' : 'cool'
      return L!.divIcon({
        html: `<div class="explorar-landing-cluster explorar-landing-cluster--${size} explorar-landing-cluster--${tone}"><span>${count}</span></div>`,
        className: 'explorar-landing-cluster-wrap',
        iconSize: L!.point(size === 'lg' ? 52 : size === 'md' ? 44 : 36, size === 'lg' ? 52 : size === 'md' ? 44 : 36),
      })
    },
  })
  map.addLayer(cluster)

  map.on('dragstart', onDragStart)
  map.on('moveend', onMoveEnd)

  syncUserMarker()
  syncMarkers()
  fitToContent(true)
  ready.value = true

  requestAnimationFrame(() => {
    map?.invalidateSize()
  })
})

onUnmounted(() => {
  if (moveTimer) clearTimeout(moveTimer)
  if (suppressTimer) clearTimeout(suppressTimer)
  map?.off('dragstart', onDragStart)
  map?.off('moveend', onMoveEnd)
  clearUserLayers()
  map?.remove()
  map = null
  cluster = null
  L = null
  markersByGuid.clear()
})

watch(
  () => props.itens,
  () => {
    syncMarkers()
  },
  { deep: true },
)

watch(
  () => [props.userLat, props.userLng, props.userAccuracy] as const,
  () => {
    syncUserMarker()
  },
)

watch(
  () => props.selectedGuid,
  (guid, prev) => {
    syncMarkers()
    if (guid && guid !== prev) {
      const item = props.itens.find((i) => i.publicGuid === guid)
      if (item && estabelecimentoTemCoordenadas(item) && map) {
        withSuppressedBounds(() => {
          map?.flyTo([item.latitude, item.longitude], Math.max(map.getZoom(), 15), {
            duration: 0.55,
          })
        }, 900)
      }
    }
  },
)

watch(
  () => props.focusGuid,
  (guid) => {
    if (guid) focusEstabelecimento(guid)
  },
)

defineExpose({
  focusEstabelecimento,
  fitToContent,
  recenterUser() {
    if (!map || props.userLat == null || props.userLng == null) return
    withSuppressedBounds(() => {
      map?.flyTo([props.userLat!, props.userLng!], 14, { duration: 0.5 })
    }, 800)
  },
  invalidateSize() {
    map?.invalidateSize()
  },
})
</script>

<template>
  <div
    class="explorar-landing-mapa"
    :class="{
      'explorar-landing-mapa--ready': ready,
      'explorar-landing-mapa--immersive': immersive,
    }"
  >
    <div
      ref="mapEl"
      class="explorar-landing-mapa__canvas"
      role="application"
      aria-label="Mapa de estabelecimentos Glow Up Connect"
    />

    <ExplorarLojasCard
      v-if="selectedItem"
      :item="selectedItem"
      :user-lat="userLat"
      :user-lng="userLng"
      @close="emit('update:selectedGuid', null)"
    />

    <p
      v-if="itens.length > 0 && itens.every((i) => !estabelecimentoTemCoordenadas(i))"
      class="explorar-landing-mapa__hint"
    >
      As lojas encontradas ainda não têm coordenadas no mapa.
    </p>
  </div>
</template>

<style>
.explorar-landing-mapa {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scale(1.02);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.explorar-landing-mapa--ready {
  opacity: 1;
  transform: scale(1);
}

.explorar-landing-mapa__canvas {
  width: 100%;
  height: 100%;
  background: #120a2a;
  border-radius: inherit;
}

.explorar-landing-mapa--immersive .explorar-landing-mapa__canvas {
  border-radius: 0;
}

.explorar-landing-mapa--immersive .leaflet-control-zoom {
  margin-bottom: 1.1rem !important;
  margin-right: 0.85rem !important;
}

.explorar-landing-mapa__hint {
  position: absolute;
  inset: auto 1rem 1rem;
  z-index: 500;
  margin: 0;
  border-radius: 0.75rem;
  background: rgb(13 8 37 / 0.92);
  border: 1px solid rgb(255 255 255 / 0.12);
  padding: 0.65rem 0.85rem;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  color: rgb(255 255 255 / 0.55);
}

.explorar-landing-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.explorar-landing-marker {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  max-width: 12.5rem;
  min-height: 2.3rem;
  height: auto;
  margin: 0;
  padding: 0.2rem 0.7rem 0.2rem 0.2rem;
  border: 1px solid rgb(201 162 39 / 0.35);
  border-radius: 9999px;
  background: linear-gradient(135deg, rgb(26 18 56 / 0.95), rgb(13 8 37 / 0.92));
  box-shadow:
    0 10px 22px -12px rgb(0 0 0 / 0.55),
    0 0 0 1px rgb(255 255 255 / 0.06);
  color: #fff;
  cursor: pointer;
  transform: translate(-1.05rem, calc(-100% - 0.35rem));
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
  animation: explorar-marker-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes explorar-marker-pop {
  from {
    opacity: 0;
    transform: translate(-1.05rem, calc(-100% - 0.1rem)) scale(0.86);
  }
  to {
    opacity: 1;
    transform: translate(-1.05rem, calc(-100% - 0.35rem)) scale(1);
  }
}

.explorar-landing-marker:hover {
  transform: translate(-1.05rem, calc(-100% - 0.5rem)) scale(1.04);
  border-color: var(--glow-gold, #c9a227);
  box-shadow:
    0 14px 28px -12px rgb(0 0 0 / 0.6),
    0 0 0 3px rgb(201 162 39 / 0.22);
}

.explorar-landing-marker--selected {
  transform: translate(-1.05rem, calc(-100% - 0.5rem)) scale(1.05);
  border-color: var(--glow-gold, #c9a227);
  background: linear-gradient(135deg, rgb(201 162 39 / 0.28), rgb(26 18 56 / 0.95));
  box-shadow:
    0 14px 28px -12px rgb(0 0 0 / 0.6),
    0 0 0 3px rgb(201 162 39 / 0.28);
}

.explorar-landing-marker--destaque {
  border-color: color-mix(in srgb, #c9a227 70%, #fff);
}

.explorar-landing-marker__avatar {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 1.9rem;
  height: 1.9rem;
  overflow: hidden;
  border-radius: 9999px;
  border: 1.5px solid rgb(255 255 255 / 0.85);
  background: var(--glow-gold, #c9a227);
}

.explorar-landing-marker__logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.explorar-landing-marker__initial {
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: #0d0825;
  line-height: 1;
}

.explorar-landing-marker__name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.1;
  padding-right: 0.15rem;
}

.explorar-landing-marker__text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.05rem;
  text-align: left;
}

.explorar-landing-marker__sub {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.58rem;
  font-weight: 500;
  line-height: 1.15;
  color: rgb(255 255 255 / 0.62);
  padding-right: 0.15rem;
}

.explorar-landing-cluster-wrap {
  background: transparent !important;
  border: none !important;
}

.explorar-landing-cluster {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: 2px solid rgb(255 255 255 / 0.92);
  background: #51c4e0;
  color: #fff;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 6px 16px -6px rgb(0 0 0 / 0.55);
}

.explorar-landing-cluster--cool {
  background: #51c4e0;
}

.explorar-landing-cluster--warm {
  background: #a8e063;
  color: #1a1a1a;
}

.explorar-landing-cluster--hot {
  background: #c9a227;
  color: #0d0825;
}

.explorar-landing-cluster--sm {
  width: 36px;
  height: 36px;
  font-size: 0.78rem;
}

.explorar-landing-cluster--md {
  width: 44px;
  height: 44px;
  font-size: 0.85rem;
}

.explorar-landing-cluster--lg {
  width: 52px;
  height: 52px;
  font-size: 0.95rem;
}

/* Marcadores estilo ponto + rótulo (modo imersivo) */
.explorar-landing-dot {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transform: translate(-1rem, -50%);
  text-align: left;
}

.explorar-landing-dot__core {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 2rem;
  height: 2rem;
  overflow: hidden;
  border-radius: 9999px;
  border: 2px solid #fff;
  background: #51c4e0;
  box-shadow: 0 6px 14px -6px rgb(0 0 0 / 0.55);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.explorar-landing-dot__meta {
  display: flex;
  min-width: 0;
  max-width: 11.5rem;
  flex-direction: column;
  gap: 0.08rem;
  padding: 0.28rem 0.55rem 0.32rem;
  border: 1px solid rgb(255 255 255 / 0.16);
  border-radius: 6px;
  background: rgb(8 6 18 / 0.88);
  box-shadow: 0 8px 18px -10px rgb(0 0 0 / 0.7);
  backdrop-filter: blur(8px);
}

.explorar-landing-dot__kind {
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(201 162 39 / 0.95);
}

.explorar-landing-dot__name {
  overflow: hidden;
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.15;
  color: #fff;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.explorar-landing-dot__sub {
  overflow: hidden;
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.62rem;
  font-weight: 500;
  line-height: 1.2;
  color: rgb(255 255 255 / 0.62);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.explorar-landing-dot:hover .explorar-landing-dot__core,
.explorar-landing-dot--selected .explorar-landing-dot__core {
  transform: scale(1.12);
  box-shadow:
    0 8px 18px -6px rgb(0 0 0 / 0.6),
    0 0 0 4px rgb(201 162 39 / 0.35);
}

.explorar-landing-dot--destaque .explorar-landing-dot__core {
  background: #c9a227;
}

.explorar-landing-dot--selected .explorar-landing-dot__core {
  background: #c9a227;
}

.explorar-landing-dot--selected .explorar-landing-dot__meta {
  border-color: rgb(201 162 39 / 0.55);
}

.explorar-landing-dot .explorar-landing-marker__logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.explorar-landing-dot .explorar-landing-marker__initial {
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: #0d0825;
}

/* Ponto do usuário */
.explorar-landing-you {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transform: translate(-0.55rem, -50%);
  pointer-events: none;
}

.explorar-landing-you__core {
  flex: 0 0 auto;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 9999px;
  border: 2px solid #fff;
  background: #c9a227;
  box-shadow:
    0 0 0 6px rgb(201 162 39 / 0.22),
    0 6px 14px -6px rgb(0 0 0 / 0.55);
}

.explorar-landing-you__meta {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  padding: 0.22rem 0.5rem 0.26rem;
  border: 1px solid rgb(201 162 39 / 0.45);
  border-radius: 6px;
  background: rgb(8 6 18 / 0.9);
  box-shadow: 0 8px 18px -10px rgb(0 0 0 / 0.7);
  backdrop-filter: blur(8px);
}

.explorar-landing-you__label {
  font-family: Satoshi, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
}

.explorar-landing-you__sub {
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgb(201 162 39 / 0.95);
}

.explorar-landing-mapa .leaflet-container {
  font-family: Urbanist, ui-sans-serif, system-ui, sans-serif;
  z-index: 0;
  background: #120a2a;
  border-radius: inherit;
}

.explorar-landing-mapa .leaflet-control-zoom a {
  background: rgb(26 18 56 / 0.92) !important;
  color: #fff !important;
  border-color: rgb(255 255 255 / 0.12) !important;
}

.explorar-landing-mapa .leaflet-control-attribution {
  background: rgb(13 8 37 / 0.75) !important;
  color: rgb(255 255 255 / 0.45) !important;
}

.explorar-landing-mapa .leaflet-control-attribution a {
  color: rgb(201 162 39 / 0.85) !important;
}

@media (prefers-reduced-motion: reduce) {
  .explorar-landing-mapa,
  .explorar-landing-marker {
    animation: none !important;
    transition: none !important;
  }
}
</style>
