import { afterNextRender, ElementRef, Injector } from '@angular/core';

/**
 * Moves the focus to the first element that matches once Angular has drawn the change.
 * @param host - The component that contains the element.
 * @param selector - The CSS selector of the element.
 * @param injector - The injector of that component, which ties the wait to its life.
 */
function focusMatchAfterRender(
  host: ElementRef<HTMLElement>,
  selector: string,
  injector: Injector,
): void {
  afterNextRender(() => host.nativeElement.querySelector<HTMLElement>(selector)?.focus(), {
    injector,
  });
}

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
  focusMatchAfterRender(host, `#${id}`, injector);
}

/**
 * Moves the focus to the first field that shows an error, once Angular has marked it.
 * @param host - The component that contains the fields.
 * @param injector - The injector of that component, which ties the wait to its life.
 */
export function focusFirstErrorAfterRender(
  host: ElementRef<HTMLElement>,
  injector: Injector,
): void {
  focusMatchAfterRender(host, '[aria-invalid="true"]', injector);
}
