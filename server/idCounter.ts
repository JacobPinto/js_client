type CSOType = "grid" | "lb_solver" | "boundaryCondition" | "block" ;

class IdCounter {
  private _counters: Map<string, number> = new Map();

  next(type: CSOType): number {
    const current = this._counters.get(type) ?? 0;
    const next = current + 1;
    this._counters.set(type, next);
    return next;
  }

  peek(type: CSOType): number {
    return this._counters.get(type) ?? 0;
  }

  // Call after loadFromFile() so IDs don't collide
  sync(type: CSOType, existingIds: number[]): void {
    if (existingIds.length === 0) return;
    const max = Math.max(...existingIds);
    const current = this._counters.get(type) ?? 0;
    if (max > current) {
      this._counters.set(type, max);
    }
  }

  reset(type: CSOType): void {
    this._counters.delete(type);
  }
}

export const idCounter = new IdCounter();