// Browser extensions (Google Translate, Grammarly, etc.) and third-party widgets
// sometimes move or wrap DOM nodes React owns. When React later removes or
// inserts around those nodes, the browser throws "removeChild/insertBefore:
// node is not a child of this node" and the whole app unmounts (blank page).
// Known React issue #11538: make those two calls tolerant instead of fatal.
export const installDomGuard = () => {
  if (typeof Node !== "function" || !Node.prototype) return;
  const proto = Node.prototype as Node & { __vectyrDomGuard?: boolean };
  if (proto.__vectyrDomGuard) return;
  proto.__vectyrDomGuard = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) child.parentNode.removeChild(child);
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return originalInsertBefore.call(this, newNode, null) as T;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
};
