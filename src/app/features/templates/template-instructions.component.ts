import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TemplatesService } from '../../services/templates/templates';
import { TemplateDefinition, TemplateGuidance } from '../../models';
import { CardComponent, PageHeaderComponent } from '../../shared/components';

/**
 * Template Instructions Viewer (PAGE-TEMPLATE-003) — in-portal access point for a
 * template's instruction document. Phase 1 links/opens the source document
 * (SharePoint) rather than rendering raw files in-app (Data Model Inventory
 * §16.4); the page surrounds it with template metadata and key-section guidance.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-template-instructions',
  imports: [CommonModule, RouterLink, CardComponent, PageHeaderComponent],
  template: `
    @if (template(); as tmpl) {
      <pmo-page-header
        [title]="tmpl.name + ' — Instructions'"
        [breadcrumbs]="['Home', 'Template Library', tmpl.name, 'Instructions']"
      >
        <div actions>
          <a [routerLink]="['/templates', tmpl.id]" class="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#dde2e8] bg-white text-[#0f2d52] hover:bg-slate-50 text-xs font-bold shadow-sm cursor-pointer transition-colors">
            ← Back to Template Detail
          </a>
        </div>
      </pmo-page-header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <pmo-card [topBorder]="'brand'">
            <div class="flex flex-col items-center justify-center text-center py-10 px-4 border-2 border-dashed border-[#cdd7e3] rounded-xl bg-slate-50/60">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-[#1e5fa5] mb-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 class="text-base font-extrabold text-[#0f2d52] m-0">Instruction document</h3>
              <p class="text-sm text-slate-500 leading-relaxed mt-1 mb-5 max-w-md">
                The full instructions for completing the {{ tmpl.name }} template are maintained in the PMO document
                library. Open or download them below.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <a [href]="tmpl.instructionsUrl" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-xs font-bold shadow-md cursor-pointer transition-colors">
                  Open Instructions in New Window
                </a>
                <a [href]="tmpl.instructionsUrl" download class="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg border border-[#dde2e8] bg-white text-[#0f2d52] hover:bg-slate-50 text-xs font-bold shadow-sm cursor-pointer transition-colors">
                  Download Instructions
                </a>
              </div>
            </div>
          </pmo-card>

          @if (guidance(); as g) {
            <pmo-card [topBorder]="'brand'">
              <h3 class="text-base font-extrabold text-[#0f2d52] m-0 mb-3">What this template covers</h3>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 m-0 p-0 list-none">
                @for (section of g.keySections; track section) {
                  <li class="flex gap-2 text-sm text-slate-600"><span class="text-[#1e5fa5] font-bold">•</span>{{ section }}</li>
                }
              </ul>
            </pmo-card>
          }
        </div>

        <div class="space-y-6">
          <pmo-card>
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-3">Template details</h4>
            <dl class="space-y-3 m-0">
              <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Template ID</dt><dd class="text-sm font-bold text-[#0f2d52] m-0 font-mono">{{ tmpl.id }}</dd></div>
              <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Version</dt><dd class="text-sm text-slate-700 m-0">v{{ tmpl.version }}</dd></div>
              <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Last updated</dt><dd class="text-sm text-slate-700 m-0">{{ tmpl.lastUpdated }}</dd></div>
              @if (tmpl.gate) {
                <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Associated gate</dt><dd class="text-sm text-slate-700 m-0">{{ tmpl.gate }}</dd></div>
              }
              <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Applies to</dt><dd class="text-sm text-slate-700 m-0">{{ tmpl.tierApplicability }}</dd></div>
            </dl>
          </pmo-card>

          <a routerLink="/learning" class="block rounded-[14px] border border-[#eef2f6] bg-[#f7f9fc] p-4 shadow-sm hover:bg-slate-50 transition-colors">
            <p class="text-[12px] font-bold text-[#0f2d52] m-0">Related worked examples</p>
            <p class="text-[12px] text-slate-500 m-0 mt-0.5">Browse guides and examples in Learning &amp; Resources →</p>
          </a>
        </div>
      </div>
    } @else if (loaded()) {
      <pmo-page-header title="Instructions not found" [breadcrumbs]="['Home', 'Template Library', 'Not found']"></pmo-page-header>
      <pmo-card>
        <div class="text-center py-10">
          <p class="text-sm font-bold text-[#0f2d52] m-0">We couldn't find that template</p>
          <a routerLink="/templates" class="inline-flex mt-4 h-9 px-4 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-xs font-bold cursor-pointer transition-colors items-center">Back to Template Library</a>
        </div>
      </pmo-card>
    }
  `,
})
export class TemplateInstructionsComponent {
  private route = inject(ActivatedRoute);
  private templatesService = inject(TemplatesService);

  readonly template = signal<TemplateDefinition | undefined>(undefined);
  readonly guidance = signal<TemplateGuidance | undefined>(undefined);
  readonly loaded = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      template: this.templatesService.getTemplateById(id),
      guidance: this.templatesService.getTemplateGuidance(id),
    }).subscribe(({ template, guidance }) => {
      this.template.set(template);
      this.guidance.set(guidance);
      this.loaded.set(true);
    });
  }
}
