<script setup lang="ts">
  import type { CertificateEntry } from '@/composables/usePortfolioData'

  defineProps<{
    certificates: CertificateEntry[]
  }>()

  const activeCertificate = ref<CertificateEntry | null>(null)
  const { smAndDown } = useDisplay()
  const isDialogOpen = computed({
    get: () => activeCertificate.value !== null,
    set: value => {
      if (!value) activeCertificate.value = null
    },
  })

  function openCertificate (certificate: CertificateEntry) {
    activeCertificate.value = certificate
  }
</script>

<template>
  <div class="certificates-carousel">
    <v-slide-group
      center-active
      class="certificates-carousel__track"
      :show-arrows="!smAndDown"
    >
      <v-slide-group-item
        v-for="certificate in certificates"
        :key="certificate.slug"
      >
        <article class="certificates-carousel__item">
          <v-card
            class="certificates-carousel__card glass-card h-100"
            rounded="xl"
            tabindex="0"
            @click="openCertificate(certificate)"
            @keydown.enter="openCertificate(certificate)"
            @keydown.space.prevent="openCertificate(certificate)"
          >
            <div class="certificates-carousel__card-body">
              <div class="certificates-carousel__card-heading">
                <v-icon color="primary" icon="mdi-certificate-outline" size="30" />

                <v-chip class="text-none" color="primary" size="small" variant="tonal">
                  {{ certificate.issued }}
                </v-chip>
              </div>

              <p class="certificates-carousel__category">
                {{ certificate.category }}
              </p>

              <h3 class="certificates-carousel__title">
                {{ certificate.title }}
              </h3>

              <p class="certificates-carousel__issuer">
                {{ certificate.issuer }}
              </p>

              <div class="certificates-carousel__tags">
                <v-chip
                  v-for="tag in certificate.tags.slice(0, 3)"
                  :key="tag"
                  class="text-none"
                  size="small"
                  variant="outlined"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </div>

            <v-divider />

            <div class="certificates-carousel__actions">
              <span class="certificates-carousel__view-label">
                View certificate
                <v-icon icon="mdi-arrow-top-right" size="18" />
              </span>

              <v-btn
                :aria-label="`Download ${certificate.title} PDF`"
                class="text-none"
                :download="`${certificate.slug}.pdf`"
                :href="certificate.pdfUrl"
                icon="mdi-download"
                size="small"
                variant="text"
                @click.stop
              />
            </div>
          </v-card>
        </article>
      </v-slide-group-item>
    </v-slide-group>

    <p class="certificates-carousel__hint">
      Scroll or use the arrows to explore {{ certificates.length }} certificates.
    </p>

    <v-dialog
      v-model="isDialogOpen"
      :fullscreen="smAndDown"
      max-width="1180"
      scrollable
      :width="smAndDown ? undefined : 'calc(100% - 32px)'"
    >
      <v-card v-if="activeCertificate" class="certificates-carousel__dialog glass-card" rounded="xl">
        <div class="certificates-carousel__dialog-toolbar">
          <div>
            <p class="certificates-carousel__category mb-1">
              {{ activeCertificate.category }}
            </p>

            <h2 class="certificates-carousel__dialog-title">
              {{ activeCertificate.title }}
            </h2>
          </div>

          <v-btn
            aria-label="Close certificate"
            icon="mdi-close"
            variant="text"
            @click="isDialogOpen = false"
          />
        </div>

        <div class="certificates-carousel__dialog-content">
          <div v-if="!smAndDown" class="certificates-carousel__pdf-stage">
            <object
              :aria-label="`${activeCertificate.title} PDF preview`"
              class="certificates-carousel__pdf"
              :data="activeCertificate.pdfUrl"
              type="application/pdf"
            >
              <div class="certificates-carousel__pdf-fallback">
                <v-icon icon="mdi-file-pdf-box" size="48" />
                <p>This browser cannot embed the PDF preview.</p>

                <v-btn
                  class="text-none"
                  color="primary"
                  :href="activeCertificate.pdfUrl"
                  target="_blank"
                  variant="tonal"
                >
                  Open PDF
                </v-btn>
              </div>
            </object>
          </div>

          <div v-else class="certificates-carousel__mobile-pdf-actions">
            <v-icon color="primary" icon="mdi-file-pdf-box" size="56" />

            <p>Open the certificate PDF in your browser or download it to your device.</p>

            <div class="d-grid ga-3 w-100">
              <v-btn
                block
                class="text-none"
                color="primary"
                :href="activeCertificate.pdfUrl"
                prepend-icon="mdi-open-in-new"
                target="_blank"
                variant="tonal"
              >
                Open PDF
              </v-btn>

              <v-btn
                block
                class="text-none"
                :download="`${activeCertificate.slug}.pdf`"
                :href="activeCertificate.pdfUrl"
                prepend-icon="mdi-download"
                variant="outlined"
              >
                Download PDF
              </v-btn>
            </div>
          </div>

          <aside class="certificates-carousel__details">
            <div>
              <p class="certificates-carousel__detail-label">Issuer</p>
              <p class="certificates-carousel__detail-value">{{ activeCertificate.issuer }}</p>
            </div>

            <div>
              <p class="certificates-carousel__detail-label">Issued</p>
              <p class="certificates-carousel__detail-value">{{ activeCertificate.issued }}</p>
            </div>

            <div>
              <p class="certificates-carousel__detail-label">Credential ID</p>
              <p class="certificates-carousel__credential-id">{{ activeCertificate.credentialId }}</p>
            </div>

            <div>
              <p class="certificates-carousel__detail-label">Skills and technologies</p>

              <div class="certificates-carousel__tags mt-2">
                <v-chip
                  v-for="tag in activeCertificate.tags"
                  :key="tag"
                  class="text-none"
                  color="primary"
                  size="small"
                  variant="tonal"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </div>

            <v-btn
              block
              class="text-none mt-auto"
              color="primary"
              :download="`${activeCertificate.slug}.pdf`"
              :href="activeCertificate.pdfUrl"
              prepend-icon="mdi-download"
              variant="tonal"
            >
              Download PDF
            </v-btn>
          </aside>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
  .certificates-carousel {
    display: grid;
    gap: 12px;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    width: 100%;
  }

  .certificates-carousel__track {
    max-width: 100%;
    margin-inline: -16px;
    min-width: 0;
  }

  .certificates-carousel__item {
    height: 100%;
    padding: 8px;
    width: min(82vw, 360px);
  }

  .certificates-carousel__card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    min-height: 330px;
    min-width: 0;
    overflow: hidden;
    transition: border-color 180ms ease, transform 180ms ease;
  }

  .certificates-carousel__card:focus-visible,
  .certificates-carousel__card:hover {
    border-color: color-mix(in srgb, var(--portfolio-accent) 54%, var(--portfolio-border));
    outline: none;
    transform: translateY(-3px);
  }

  .certificates-carousel__card-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 22px;
  }

  .certificates-carousel__card-heading,
  .certificates-carousel__actions,
  .certificates-carousel__dialog-toolbar {
    align-items: center;
    display: flex;
    gap: 16px;
    justify-content: space-between;
  }

  .certificates-carousel__category,
  .certificates-carousel__detail-label {
    color: var(--portfolio-accent);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    margin: 20px 0 8px;
    text-transform: uppercase;
  }

  .certificates-carousel__title {
    font-size: 1.15rem;
    line-height: 1.35;
    margin: 0 0 10px;
    overflow-wrap: anywhere;
  }

  .certificates-carousel__issuer,
  .certificates-carousel__hint {
    color: var(--portfolio-text-muted);
  }

  .certificates-carousel__issuer {
    font-weight: 600;
    margin: 0 0 18px;
    overflow-wrap: anywhere;
  }

  .certificates-carousel__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .certificates-carousel__actions {
    min-height: 58px;
    padding: 8px 14px 8px 22px;
  }

  .certificates-carousel__view-label {
    align-items: center;
    color: var(--portfolio-accent);
    display: flex;
    font-size: 0.88rem;
    font-weight: 700;
    gap: 6px;
  }

  .certificates-carousel__hint {
    font-size: 0.85rem;
    margin: 0;
    text-align: center;
    overflow-wrap: anywhere;
  }

  .certificates-carousel__dialog {
    border: 1px solid color-mix(in srgb, var(--portfolio-accent) 18%, var(--portfolio-border));
    max-height: calc(100vh - 32px);
    overflow: hidden;
  }

  .certificates-carousel__dialog-toolbar {
    border-bottom: 1px solid var(--portfolio-border);
    padding: 16px 20px;
  }

  .certificates-carousel__dialog-toolbar .certificates-carousel__category {
    margin-top: 0;
  }

  .certificates-carousel__dialog-title {
    font-size: clamp(1.15rem, 2vw, 1.55rem);
    line-height: 1.3;
    margin: 0;
  }

  .certificates-carousel__dialog-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    min-height: min(72vh, 720px);
    overflow: auto;
  }

  .certificates-carousel__pdf-stage {
    background: color-mix(in srgb, var(--portfolio-bg) 88%, black);
    min-height: 620px;
    padding: 12px;
  }

  .certificates-carousel__pdf {
    border: 0;
    height: 100%;
    width: 100%;
  }

  .certificates-carousel__pdf-fallback {
    align-content: center;
    color: var(--portfolio-text-muted);
    display: grid;
    gap: 12px;
    height: 100%;
    justify-items: center;
    text-align: center;
  }

  .certificates-carousel__mobile-pdf-actions {
    align-content: center;
    background: color-mix(in srgb, var(--portfolio-bg) 88%, black);
    color: var(--portfolio-text-muted);
    display: grid;
    gap: 16px;
    justify-items: center;
    padding: 32px 20px;
    text-align: center;
  }

  .certificates-carousel__mobile-pdf-actions p {
    line-height: 1.6;
    margin: 0;
  }

  .certificates-carousel__details {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 24px;
  }

  .certificates-carousel__detail-label {
    margin: 0 0 6px;
  }

  .certificates-carousel__detail-value,
  .certificates-carousel__credential-id {
    color: var(--portfolio-text);
    margin: 0;
  }

  .certificates-carousel__credential-id {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.78rem;
    overflow-wrap: anywhere;
  }

  @media (min-width: 700px) {
    .certificates-carousel__item {
      width: 340px;
    }
  }

  @media (min-width: 1100px) {
    .certificates-carousel__item {
      width: 354px;
    }
  }

  @media (max-width: 800px) {
    .certificates-carousel__dialog-content {
      grid-template-columns: 1fr;
    }

    .certificates-carousel__pdf-stage {
      min-height: 58vh;
    }

    .certificates-carousel__details {
      min-height: 380px;
    }
  }

  @media (max-width: 600px) {
    .certificates-carousel__track {
      margin-inline: -8px;
    }

    .certificates-carousel__item {
      width: min(88vw, 340px);
    }

    .certificates-carousel__card-body {
      padding: 18px;
    }

    .certificates-carousel__dialog {
      border-radius: 0 !important;
      max-height: none;
    }

    .certificates-carousel__dialog-toolbar {
      align-items: flex-start;
      padding: 14px;
    }

    .certificates-carousel__pdf-stage {
      min-height: 52vh;
      padding: 6px;
    }

    .certificates-carousel__details {
      min-height: 0;
      padding: 20px;
    }

    .certificates-carousel :deep(.v-chip) {
      height: auto;
      max-width: 100%;
      white-space: normal;
    }
  }
</style>
