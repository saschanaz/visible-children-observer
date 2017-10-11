"use strict";
class VisibleChildrenObserver {
    constructor(_callback) {
        this._callback = _callback;
        this._contextMap = new Map();
    }
    observe(target) {
        if (this._contextMap.has(target)) {
            return;
        }
        const visibleChlidren = new Set();
        const intersectionObserver = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    visibleChlidren.add(entry.target);
                }
                else {
                    visibleChlidren.delete(entry.target);
                }
            }
            this._callback && this._callback(target);
        }, {
            root: target
        });
        const mutationObserver = new MutationObserver(records => {
            for (const record of records) {
                for (const addedNode of Array.from(record.addedNodes)) {
                    if (addedNode instanceof Element) {
                        intersectionObserver.observe(addedNode);
                        if (this._isIntersecting(target.getBoundingClientRect(), addedNode.getBoundingClientRect())) {
                            visibleChlidren.add(addedNode);
                            this._callback && this._callback(target);
                        }
                    }
                }
                for (const removedNode of Array.from(record.removedNodes)) {
                    if (removedNode instanceof Element) {
                        intersectionObserver.unobserve(removedNode);
                        if (visibleChlidren.delete(removedNode)) {
                            this._callback && this._callback(target);
                        }
                    }
                }
            }
        });
        for (const child of Array.from(target.children)) {
            if (this._isIntersecting(target.getBoundingClientRect(), child.getBoundingClientRect())) {
                visibleChlidren.add(child);
            }
            intersectionObserver.observe(child);
        }
        mutationObserver.observe(target, {
            childList: true
        });
        this._contextMap.set(target, {
            intersectionObserver,
            mutationObserver,
            visibleChlidren
        });
    }
    _isIntersecting(a, b) {
        let xa1 = a.x, xa2 = a.x + a.width;
        let xb1 = b.x, xb2 = b.x + b.width;
        let ya1 = a.y, ya2 = a.y + a.height;
        let yb1 = b.y, yb2 = b.y + b.height;
        const xIntersect = !(Math.min(xa1, xa2) > Math.max(xb1, xb2)) && !(Math.max(xa1, xa2) < Math.min(xb1, xb2));
        const yIntersect = !(Math.min(ya1, ya2) > Math.max(yb1, yb2)) && !(Math.max(ya1, ya2) < Math.min(yb1, yb2));
        return xIntersect && yIntersect;
    }
    getVisibleChildren(target) {
        const context = this._contextMap.get(target);
        if (!context) {
            throw new Error("Not being observed");
        }
        return [...context.visibleChlidren];
    }
    unobserve(target) {
        const context = this._contextMap.get(target);
        if (!context) {
            return;
        }
        context.mutationObserver.disconnect();
        context.intersectionObserver.disconnect();
        this._contextMap.delete(target);
    }
    disconnect() {
        for (const [key, value] of Array.from(this._contextMap)) {
            value.mutationObserver.disconnect();
            value.intersectionObserver.disconnect();
            this._contextMap.delete(key);
        }
    }
}
//# sourceMappingURL=index.js.map