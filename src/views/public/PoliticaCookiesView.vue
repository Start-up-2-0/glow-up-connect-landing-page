<script setup lang="ts">
import LegalDocumentShell from '@/components/legal/LegalDocumentShell.vue'
import { CONSENT_POLICY_VERSION, THIRD_PARTY_PROVIDERS } from '@/constants/consent'
import { ROUTE_PATHS } from '@/constants/routes'
import { useJsonLd, useSeo } from '@/composables/useSeo'
import { APP_NAME } from '@/constants/storageKeys'
import { SITE_URL } from '@/constants/urls'

useSeo({ path: ROUTE_PATHS.POLITICA_COOKIES })

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: `Política de cookies | ${APP_NAME}`,
  url: `${SITE_URL}${ROUTE_PATHS.POLITICA_COOKIES}`,
  isPartOf: {
    '@type': 'WebSite',
    name: APP_NAME,
    url: SITE_URL,
  },
  inLanguage: 'pt-BR',
})
</script>

<template>
  <LegalDocumentShell
    title="Política de cookies"
    :subtitle="`Versão ${CONSENT_POLICY_VERSION} — última atualização: 24 de agosto de 2026`"
  >
    <section>
      <h2>O que são cookies?</h2>
      <p>
        Cookies são pequenos arquivos armazenados no seu navegador. Também utilizamos tecnologias
        similares, como armazenamento local e de sessão, para lembrar preferências e manter você
        autenticado com segurança.
      </p>
    </section>

    <section>
      <h2>Categorias que utilizamos</h2>
      <ul>
        <li>
          <strong>Essenciais:</strong> necessários para login, renovação de sessão (cookie HttpOnly
          de refresh), tema visual e funcionamento básico. Não podem ser desativados.
        </li>
        <li>
          <strong>Serviços de terceiros:</strong> permitem carregar SDKs e consultar APIs externas
          para pagamentos e preenchimento de endereço. Só são ativados após seu consentimento.
        </li>
        <li>
          <strong>Análise:</strong> não utilizamos cookies de analytics de terceiros no momento.
        </li>
      </ul>
    </section>

    <section>
      <h2>Parceiros e APIs de terceiros</h2>
      <p>
        Quando você autoriza a categoria de serviços de terceiros, os seguintes provedores podem
        receber dados conforme o recurso utilizado:
      </p>
      <ul>
        <li v-for="provider in THIRD_PARTY_PROVIDERS" :key="provider.id">
          <strong>{{ provider.name }}</strong> — {{ provider.purpose }}
          Dados enviados: {{ provider.dataShared }}
          (<a
            :href="provider.privacyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-glow-gold-dark hover:underline"
          >política do provedor</a>).
        </li>
      </ul>
    </section>

    <section>
      <h2>Como gerenciar suas preferências</h2>
      <p>
        Na primeira visita, exibimos um banner para você aceitar, recusar ou personalizar cookies
        não essenciais. Usuários autenticados também podem revisar preferências em
        Configurações → Privacidade.
      </p>
      <p>
        Se revogar o consentimento para serviços de terceiros, recursos como pagamento com cartão
        e busca automática de CEP ficarão indisponíveis até nova autorização.
      </p>
    </section>

    <section>
      <h2>Base legal (LGPD)</h2>
      <p>
        Cookies essenciais são tratados com base no legítimo interesse e execução de contrato.
        Cookies e integrações de terceiros que não são estritamente necessários dependem do seu
        consentimento, que pode ser retirado a qualquer momento.
      </p>
    </section>

    <section>
      <h2>Conta, cookies e exclusão dos dados</h2>
      <p>
        Apagar cookies do navegador ou revogar cookies de terceiros não exclui sua conta. A
        exclusão da conta deve ser solicitada separadamente na área
        <strong>Configurações → Privacidade</strong> do aplicativo.
      </p>
      <div class="legal-callout">
        <strong>Prazo de 30 dias para reativação.</strong>
        Após a solicitação, a conta entra em processo de exclusão por 30 dias. Durante esse período,
        você pode cancelar o processo reativando a conta pelo login com seu e-mail e senha. Encerrado
        o prazo sem reativação, a exclusão é concluída e os dados pessoais são eliminados ou
        anonimizados, salvo aqueles que precisem ser conservados para cumprir obrigação legal ou
        regulatória, exercer direitos em processos ou atender às demais hipóteses permitidas pela LGPD.
      </div>
    </section>

    <section>
      <h2>Contato</h2>
      <p>
        Para exercer direitos relacionados a dados pessoais: contato@glowup.com.br ou a área de
        Privacidade no painel, quando autenticado.
      </p>
    </section>
  </LegalDocumentShell>
</template>
