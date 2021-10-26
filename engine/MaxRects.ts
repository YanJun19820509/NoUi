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

    public cut(x: number, y: number, w: number, h: number): Rect[] {
        let r = this.rect;
        let a: Rect[] = [];
        if (x > r.x)
            a[a.length] = Rect.new(r.x, r.y, x - r.x - _padding, r.height);
        else if (y > r.y)
            a[a.length] = Rect.new(r.x, r.y, r.width, y - r.y - _padding);

        a[a.length] = Rect.new(r.x, y + h + _padding, r.width, r.height - h + r.y - y - _padding);
        a[a.length] = Rect.new(x + w + _padding, r.y, r.width - w + r.x - x - _padding, r.height);

        return a;
    }

    public isEqual(x: number, y: number, w: number, h: number): boolean {
        return this.id == `${x}_${y}_${w}_${h}`;
    }

    public equalTo(r: Rect): boolean {
        if (!r) return false;
        return this.id == r.id;
    }

    public includes(w: number, h: number): boolean {
        return this.rect.width >= w && this.rect.height >= h;
    }

    public contains(r: Rect): boolean {
        if (!r) return false;
        return this.rect.containsRect(r.rect);
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
        this._addRect(_padding, _padding, width - _padding, height - _padding);
    }

    public get lastRects(): cc.Rect[] {
        let a: cc.Rect[] = [];
        this._rects.forEach(r => {
            a[a.length] = r.rect;
        });
        return a;
    }

    public find(w: number, h: number): cc.Vec2 {
        let idx = -1;
        this._rects.sort((a, b) => {
            return (a.rect.width * a.rect.height - b.rect.width * b.rect.height) || (a.rect.y - b.rect.y) || (a.rect.x - b.rect.x);
        });
        for (let i = 0, n = this._rects.length; i < n; i++) {
            let r = this._rects[i];
            if (r.includes(w, h)) {
                idx = i;
                break;
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
        let cuts = use.cut(use.rect.x, use.rect.y, w, h);
        this._mergeRects(this._createRect(use.rect.origin.x, use.rect.origin.y, w, h), cuts);
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

    private _createRect(x: number, y: number, w: number, h: number): Rect {
        if (w < 0 || h < 0) return null;
        let r = Rect.new(x, y, w, h);
        return r;
    }

    private _addRect(x: number, y: number, w: number, h: number) {
        let r = this._createRect(x, y, w, h);
        this._rects[this._rects.length] = r;
    }

    private _intersectsRect(r1: Rect, r2: Rect): boolean {
        let x: number = r1.rect.x, y: number = r1.rect.y, w: number = r1.rect.width, h: number = r1.rect.height, w1 = r1.rect.width, h1: number = r1.rect.height;
        if (r2.rect.x <= r1.rect.x) {
            x = r2.rect.xMax + _padding
            w = r1.rect.width + r1.rect.x - x;
            h1 = r2.rect.yMax - r1.rect.yMax - _padding;
        }
        if (r2.rect.y <= r1.rect.y) {
            y = r2.rect.yMax + _padding;
            h = r1.rect.height + r1.rect.y - y;
            w1 = r2.rect.x - r1.rect.x - _padding;
        }
        let a = this._createRect(r1.rect.x, r1.rect.y, w1, h1);
        if (w > 0 && h > 0) {
            r1.set(x, y, w, h);
        }
        if (a) {
            for (let i = 0, n = this._rects.length; i < n; i++) {
                if (this._rects[i].contains(a)) {
                    a = null;
                    break;
                }
            }
        }
        if (a)
            this._rects[this._rects.length] = a;

        return w > 0 && h > 0;
    }

    private _mergeRects(use: Rect, arr: Rect[]) {
        for (let i = this._rects.length - 1; i >= 0; i--) {
            if (use.contains(this._rects[i])) {
                this._rects.splice(i, 1);
            } else if (this._rects[i].rect.intersects(use.rect)) {
                let a = this._rects.splice(i, 1)[0];
                this._rects = this._rects.concat(a.cut(use.rect.x, use.rect.y, use.rect.width, use.rect.height));
            }
        }
        for (let i = arr.length - 1; i >= 0; i--) {
            let a = arr[i];
            for (let j = this._rects.length - 1; j >= 0; j--) {
                let b = this._rects[j];
                if (b.rect.containsRect(a.rect)) {
                    arr.splice(i, 1);
                } else if (a.rect.containsRect(b.rect)) {
                    this._rects.splice(j, 1);
                }
            }
        }
        this._rects = this._rects.concat(arr);
    }
}
