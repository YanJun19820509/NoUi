// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let _padding: number;
class Rect {
    public rect: cc.Rect;
    public id: string;

    constructor(x: number, y: number, w: number, h: number) {
        this.set(x, y, w, h);
    }

    public static new(x: number, y: number, w: number, h: number): Rect {
        return new Rect(x, y, w, h);
    }

    public set(x: number, y: number, w: number, h: number) {
        this.rect = cc.rect(x, y, w, h);
        this.id = `${x}_${y}_${w}_${h}`;
    }

    public cut(w: number, h: number): Rect[] {
        let r = this.rect;
        return [
            Rect.new(r.x + w + _padding, r.y, r.width - w - _padding, h),
            Rect.new(r.x, r.y + h + _padding, r.width, r.height - h - _padding),
            Rect.new(r.x, r.y + h + _padding, w, r.height - h - _padding),
            Rect.new(r.x + w + _padding, r.y, r.width - w - _padding, r.height)
        ];
    }

    public isEqual(x: number, y: number, w: number, h: number): boolean {
        return this.id == `${x}_${y}_${w}_${h}`;
    }

    public includes(w: number, h: number): boolean {
        return this.rect.width >= w && this.rect.height >= h;
    }

    public saveOrigin(origin: cc.Vec2): boolean {
        return this.rect.origin.equals(origin);
    }
}

export class MaxRects {
    private _rects: Rect[] = [];
    private _width: number;
    private _height: number;

    constructor(width: number, height: number, padding = 2) {
        this._width = width;
        this._height = height;
        _padding = padding;
        this._addRect(0, 0, width, height);
    }

    public find(w: number, h: number): cc.Vec2 {
        let idx = -1;
        for (let i = 0, n = this._rects.length; i < n; i++) {
            let r = this._rects[i];
            if (r.includes(w, h)) {
                if (idx == -1 || this._rects[idx].includes(r.rect.width, r.rect.height)) { idx = i; }
            }
        }
        if (idx == -1) return null;
        let use = this._rects.splice(idx, 1)[0];
        let r = this._getRectByOrigin(use.rect.origin);
        if (r) {
            if (r.includes(use.rect.width, use.rect.height)) {
                use = r;
            }
        }
        let cuts = use.cut(w, h);
        this._mergeRects(cuts);
        return use.rect.origin;
    }

    private _getRectByOrigin(origin: cc.Vec2, remove = true): Rect {
        for (let i = 0, n = this._rects.length; i < n; i++) {
            if (this._rects[i].saveOrigin(origin)) {
                if (remove)
                    return this._rects.splice(i, 1)[0];
                return this._rects[i];
            }
        }
    }

    private _addRect(x: number, y: number, w: number, h: number) {
        let r = Rect.new(x + _padding, y + _padding, w - _padding, h - _padding);
        this._rects[this._rects.length] = r;
    }

    private _mergeRects(arr: Rect[]) {
        for (let i = arr.length - 1; i >= 0; i--) {
            let a = arr[i];
            for (let j = this._rects.length - 1; j >= 0; j--) {
                let b = this._rects[j];
                if (b.rect.containsRect(a.rect)) {
                    arr.splice(i, 1);
                } else if (a.rect.containsRect(b.rect)) {
                    this._rects.slice(j, 1);
                } else if (b.rect.intersects(a.rect)) {
                    if (a.rect.xMax >= b.rect.xMax && a.rect.yMax >= b.rect.yMax) {
                        this._rects.slice(j, 1);
                    } else {
                        let x: number = b.rect.x, y: number = b.rect.y, w: number = b.rect.width, h: number = b.rect.height;
                        if (a.rect.x < b.rect.x) {
                            x = a.rect.xMax + _padding
                            w = b.rect.width + b.rect.x - x;
                        }
                        if (a.rect.y < b.rect.y) {
                            y = a.rect.yMax + _padding;
                            h = b.rect.height + b.rect.x - y;
                        }
                        b.set(x, y, w, h);
                    }
                } else if (a.rect.xMax == b.rect.x - _padding || b.rect.xMax == a.rect.x - _padding) {
                    let x = Math.min(a.rect.x, b.rect.x);
                    let y = Math.max(a.rect.y, b.rect.y);
                    let w = Math.max(a.rect.xMax, b.rect.xMax);
                    let h = Math.min(a.rect.height, b.rect.height);
                    this._addRect(x, y, w, h);
                } else if (a.rect.yMax == b.rect.y - _padding || b.rect.yMax == a.rect.y - _padding) {
                    let x = Math.max(a.rect.x, b.rect.x);
                    let y = Math.min(a.rect.y, b.rect.y);
                    let w = Math.min(a.rect.width, b.rect.width);
                    let h = Math.max(a.rect.yMax, b.rect.yMax);
                    this._addRect(x - _padding, y - _padding, w - _padding, h - _padding);
                }
            }
        }
        this._rects = this._rects.concat(arr);
    }
}
