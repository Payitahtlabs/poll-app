import { Component, computed, ElementRef, inject, input, output, signal } from '@angular/core';
import { SURVEY_CATEGORIES, SurveyCategory } from '../../models/survey-category';

@Component({
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(keydown.escape)': 'closeMenu()',
  },
  selector: 'app-category-filter',
  styleUrl: './category-filter.scss',
  templateUrl: './category-filter.html',
})
export class CategoryFilter {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly categories = SURVEY_CATEGORIES;
  readonly selected = input<SurveyCategory | null>(null);
  readonly categorySelected = output<SurveyCategory | null>();
  readonly isOpen = signal(false);
  readonly isHighlighted = computed(() => this.isOpen() || this.selected() !== null);

  /** Opens the menu when it is closed and closes it when it is open. */
  toggleMenu(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  /** Closes the menu. */
  closeMenu(): void {
    this.isOpen.set(false);
  }

  /**
   * Reports the chosen category to the parent and closes the menu.
   * @param category - The chosen category, or null for all surveys.
   */
  selectCategory(category: SurveyCategory | null): void {
    this.categorySelected.emit(category);
    this.closeMenu();
  }

  /**
   * Closes the menu when a click lands outside of this filter.
   * @param event - The click that happened somewhere in the document.
   */
  closeOnOutsideClick(event: Event): void {
    const isInside = this.host.nativeElement.contains(event.target as Node);
    if (!isInside) {
      this.closeMenu();
    }
  }
}
