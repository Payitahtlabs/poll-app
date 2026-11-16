import { afterNextRender, ElementRef, Injector } from '@angular/core';

/**
 * Moves the focus to a field once Angular has drawn it.
 * @param host - The component that contains the field.
 * @param id - The id of the field.
 * @param injector - The injector of that component, which ties the wait to its life.
 */
export function focusAfterRender(
  host: ElementRef<HTMLElement>,
  id: string,
  injector: Injector,
): void {
  afterNextRender(() => host.nativeElement.querySelector<HTMLElement>(`#${id}`)?.focus(), {
    injector,
  });
}
