export default class VisibleChildrenObserver {
    private _callback?;
    private _contextMap;
    constructor(_callback?: ((target: HTMLElement) => any) | undefined);
    observe(target: HTMLElement): void;
    getVisibleChildren(target: HTMLElement): Element[];
    unobserve(target: HTMLElement): void;
    disconnect(): void;
}
export as namespace VisibleChildrenObserver;