import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TemplatesService } from '../../services/templates/templates';
import { TemplateDefinition, TemplateGuidance } from '../../models';
import { BadgeComponent, CardComponent, PageHeaderComponent } from '../../shared/components';

/**
 * Template Detail (PAGE-TEMPLATE-002) — a guided PMO resource for one template:
 * purpose, when to use, gate context, key sections, what to prepare, plus its
 * actions (download, instructions, start submission where supported).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-template-detail',
  imports: [CommonModule, RouterLink, CardComponent, BadgeComponent, PageHeaderComponent],
  template: `
    @if (template(); as tmpl) {
      <pmo-page-header [title]="tmpl.name" [breadcrumbs]="['Home', 'Template Library', tmpl.name]">
        <div actions>
          <a [href]="tmpl.templateUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#dde2e8] bg-white text-[#0f2d52] hover:bg-slate-50 text-xs font-bold shadow-sm cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Template
          </a>
          @if (submissionRoute(); as route) {
            <a [routerLink]="route" class="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-xs font-bold shadow-md cursor-pointer transition-colors">
              Start Submission
            </a>
          }
        </div>
      </pmo-page-header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main guidance column -->
        <div class="lg:col-span-2 space-y-6">
          <pmo-card [topBorder]="'brand'">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="text-[10px] font-bold text-slate-400 font-mono">{{ tmpl.id }}</span>
              @if (tmpl.gate) {
                <pmo-badge [type]="'info'" [text]="tmpl.gate"></pmo-badge>
              }
              <pmo-badge [type]="'default'" [text]="'Applies to ' + tmpl.tierApplicability"></pmo-badge>
              <span class="text-[11px] text-slate-400 font-medium">v{{ tmpl.version }} · Updated {{ tmpl.lastUpdated }}</span>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed m-0">{{ tmpl.description }}</p>
          </pmo-card>

          @if (guidance(); as g) {
            <pmo-card [topBorder]="'brand'">
              <h3 class="text-base font-extrabold text-[#0f2d52] m-0 mb-2">Purpose</h3>
              <p class="text-sm text-slate-600 leading-relaxed m-0 mb-5">{{ g.purpose }}</p>

              <h3 class="text-base font-extrabold text-[#0f2d52] m-0 mb-2">When to use</h3>
              <p class="text-sm text-slate-600 leading-relaxed m-0 mb-5">{{ g.whenToUse }}</p>

              <h3 class="text-base font-extrabold text-[#0f2d52] m-0 mb-2">Associated gate</h3>
              <p class="text-sm text-slate-600 leading-relaxed m-0">{{ g.gateContext }}</p>
            </pmo-card>

            <pmo-card [topBorder]="'brand'">
              <h3 class="text-base font-extrabold text-[#0f2d52] m-0 mb-3">Key sections</h3>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 m-0 p-0 list-none">
                @for (section of g.keySections; track section) {
                  <li class="flex gap-2 text-sm text-slate-600">
                    <span class="text-[#1e5fa5] font-bold">•</span>{{ section }}
                  </li>
                }
              </ul>
            </pmo-card>
          }
        </div>

        <!-- Sidebar: prepare + actions -->
        <div class="space-y-6">
          @if (guidance(); as g) {
            <div class="rounded-[14px] border-l-4 border-l-[#d4a63a] border border-[#eef2f6] bg-white p-5 shadow-sm">
              <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-3">Prepare before you submit</h4>
              <ul class="space-y-2.5 m-0 p-0 list-none">
                @for (item of g.prepareBeforeSubmission; track item) {
                  <li class="flex gap-2 text-[13px] text-slate-600 leading-relaxed">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ item }}</span>
                  </li>
                }
              </ul>
            </div>
          }

          <pmo-card>
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-3">Actions</h4>
            <div class="space-y-2">
              @if (submissionRoute(); as route) {
                <a [routerLink]="route" class="w-full h-9 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center">Start Submission</a>
              }
              <a [routerLink]="['/templates', tmpl.id, 'instructions']" class="w-full h-9 rounded-lg border border-[#dde2e8] bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center">View Instructions</a>
              <a [href]="tmpl.templateUrl" target="_blank" rel="noopener" class="w-full h-9 rounded-lg border border-[#dde2e8] bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center">Download Template</a>
              <a routerLink="/learning" class="w-full h-9 rounded-lg border border-[#dde2e8] bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center">Related Learning</a>
            </div>
          </pmo-card>

          <div class="rounded-[14px] border border-[#eef2f6] bg-[#f7f9fc] p-4 shadow-sm">
            <div class="flex gap-2 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#1e5fa5] shrink-0 mt-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <p class="text-[12px] text-slate-600 leading-relaxed m-0">
                Have a question about this template? Ask the <strong class="text-[#0f2d52]">PMO Copilot</strong> in the panel on the right — it can help you understand sections and readiness (it does not make governance decisions).
              </p>
            </div>
          </div>
        </div>
      </div>
    } @else if (loaded()) {
      <pmo-page-header title="Template not found" [breadcrumbs]="['Home', 'Template Library', 'Not found']"></pmo-page-header>
      <pmo-card>
        <div class="text-center py-10">
          <p class="text-sm font-bold text-[#0f2d52] m-0">We couldn't find that template</p>
          <p class="text-xs text-slate-500 mt-1">It may have been moved or the link is incorrect.</p>
          <a routerLink="/templates" class="inline-flex mt-4 h-9 px-4 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-xs font-bold cursor-pointer transition-colors items-center">Back to Template Library</a>
        </div>
      </pmo-card>
    }
  `,
})
export class TemplateDetailComponent {
  private route = inject(ActivatedRoute);
  private templatesService = inject(TemplatesService);

  readonly template = signal<TemplateDefinition | undefined>(undefined);
  readonly guidance = signal<TemplateGuidance | undefined>(undefined);
  readonly loaded = signal(false);

  readonly submissionRoute = computed(() => this.guidance()?.submissionRoute ?? null);

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
