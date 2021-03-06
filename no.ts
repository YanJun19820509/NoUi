const { ccclass, property } = cc._decorator;

export namespace no {

    /**
    * 消息系统
    */
    export let Evn = cc.systemEvent;

    class st {
        private _time: number;

        public get now(): number {
            return this._time;
        }

        public set now(v: number) {
            this._time = v;
        }

        constructor() {
            this._time = Math.floor((new Date()).getTime() / 1000);
            setInterval(() => {
                this._time++;
            }, 1000);
        }
    }

    /**系统时间 */
    export let SysTime = new st();



    /**
     * 通用二维属性类
     */
    export class Property2D {
        public x: number;
        public y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public equals(other: Property2D): boolean {
            return this.x == other.x && this.y == other.y;
        }

        public toVec3(): cc.Vec3 {
            let a = cc.Vec3.ZERO;
            a.x = this.x;
            a.y = this.y;
            return a;
        }
    }

    /**事件处理类 */
    @ccclass('EventHandlerInfo')
    export class EventHandlerInfo {
        @property(cc.Component.EventHandler)
        hander: cc.Component.EventHandler = new cc.Component.EventHandler();
        @property({ step: 1 })
        order: number = 0;

        public static execute(handlers: EventHandlerInfo[], ...args: any[]): void {
            if (handlers.length == 0) return;
            this.sort(handlers);
            handlers.forEach(handler => {
                handler.hander.emit([].concat(args, handler.hander.customEventData));
            });
        }

        private static sort(handlers: EventHandlerInfo[]): void {
            if (handlers.length == 0) return;
            handlers.sort((a, b) => {
                return a.order - b.order;
            });
        }

        public execute(...args: any[]): void {
            this.hander.emit([].concat(args, this.hander.customEventData));
        }
    }

    /**debug用时间日志 */
    @ccclass('TimeWatcher')
    export class TimeWatcher {
        public static get new(): TimeWatcher {
            return new TimeWatcher();
        }

        private t: number;
        constructor() {
            this.t = timestampMs();
            err('TimeWatcher', 'start', this.t);
        }

        public blink(Evn?: string): void {
            let t = timestampMs();
            err('TimeWatcher', Evn || 'blink', t - this.t);
            this.t = t;
        }
    }

    export function log(...Evns: any[]): void {
        if (CC_DEBUG) {
            console.log.call(console, '#NoUi#', Evns);
        }
    }

    export function err(...Evns: any[]): void {
        if (CC_DEBUG) {
            console.error.call(console, '#NoUi#', Evns);
        }
    }

    /**
     * 发出消息并回调一次
     * @param type
     * @param callback
     * @param args
     * @param target
     */
    export function emitAndOnceCallback(emitType: string, callbackType: string, callback: (v: any) => void, args?: any[], target?: any): void {
        if (Evn['_callbackTable']?.[emitType] == null) {
            callback(null);
        } else {
            Evn.once(callbackType, callback, target);
            Evn.emit(emitType, args);
        }
    }

    export async function emitAndOnceCallbackAsync(emitType: string, callbackType: string, args?: any[], target?: any): Promise<any> {
        return new Promise<any>(resolve => {
            this.emitAndOnceCallback(emitType, callbackType, resolve, args, target);
        });
    }

    /**
     * 等待事件
     * @param type 事件类型
     * @param target
     * @param arg 标识，当事件触发时会将这个值返回
     */
    export async function waitForEvent(type: string, target?: any, arg?: any): Promise<any> {
        return new Promise<any>(resolve => {
            Evn.once(type, () => {
                resolve(arg);
            }, target);
        });
    }

    export async function waitFor(express: (dt?: number) => boolean): Promise<void> {
        return new Promise<void>(resolve => {
            this.callUntil(express, resolve);
        });
    }

    export async function waiForEventValue(type: string, target?: any): Promise<any> {
        return new Promise<any>(resolve => {
            Evn.once(type, resolve, target);
        });
    }

    export function callUntil(express: (dt?: number) => boolean, callback: () => void, dt = 0): void {
        if (express(dt)) {
            callback?.();
            return;
        }
        dt = cc.director.getDeltaTime();
        window.setTimeout(() => {
            this.callUntil(express, callback, dt);
        }, dt * 1000);
    }

    /**
     * 根据模板格式化字符串
     * @param formatter 模板，如'{a}:{b}:{c}' {0}:{1}:{2}
     * @param data 需要替换的数据，如{'a':1,'b':2,'c':3}，返回1:2:3  [1,2,3] 1:2:3
     */
    export function formatString(formatter: string, data: any): string {
        var s = formatter;
        let keys = Object.keys(data);
        keys.forEach(k => {
            s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), data[k]);
        });
        return s;
    }

    export function evalFormateStr(formatter: string, data: any) {
        let str = this.formatString(formatter, data);
        return this.eval(str);
    }

    /**
     * clone JSON对象
     * @param json
     */
    export function cloneJson(json: any): any {
        return JSON.parse(JSON.stringify(json));
    }


    /**
     *
     * @param hex '#412a00'
     * @returns {r: 65, g: 42, b: 0}
     */
    export function hex2Rgb(hex: string) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


    /**
     * 封装cc.Color.fromHEX
     * @param v
     */
    export function str2Color(v: string): cc.Color {
        let c = cc.color();
        cc.Color.fromHEX(c, v);
        return c;
    }

    function hex2Ten(v: string): number {
        let l = v.length;
        var a = 0;
        for (var i = 0; i < l; i++) {
            var b: number;
            switch (v[i].toLowerCase()) {
                case 'a':
                    b = 10;
                    break;
                case 'b':
                    b = 11;
                    break;
                case 'c':
                    b = 12;
                    break;
                case 'd':
                    b = 13;
                    break;
                case 'e':
                    b = 14;
                    break;
                case 'f':
                    b = 15;
                    break;
                default:
                    b = parseInt(v[i]);
                    break;
            }
            a += Math.pow(16, l - i - 1) * b;
        }
        return a;
    }

    /**
     * 大数字转换成最多3位数加单位的格式
     * @param n
     */
    export function num2str(n: number): string {
        if (n < 1000) return String(n);
        let unit = ['k', 'm', 'b'];
        var a = '';
        let s = String(n);
        let len = s.length;
        let l = len % 3;
        if (l == 1) {
            a = s[0] + '.' + s[1];
        } else {
            a = s[0] + s[1] + (l == 0 ? s[2] : '');
        }
        return a + unit[Math.floor(len / 3) - 1 - (l == 0 ? 1 : 0)];
    }

    /**
     * 从数组里随机几n个元素
     * @param arr
     * @param n
     */
    export function arrayRandom(arr: any, n = 1): any {
        if (!arr || arr.length == 0) return null;
        if (arr.length == 1) return arr[0];
        if (arr.length == n) return arr;
        let a = [].concat(arr);
        let c = [];
        for (var i = 0; i < n; i++) {
            let al = a.length;
            if (al == 0) break;
            let b = Math.floor(Math.random() * al);
            c = [].concat(c, a.splice(b, 1));
        }
        return n == 1 ? c[0] : c;
    }

    /**
     * 从object中获取值
     * @param data
     * @param path 如a.b.c
     */
    export function getValue(data: Object, path?: string): any {
        if (!path) {
            return data;
        }
        let p = path.split('.');
        let o = data;
        let max = p.length;
        for (let index = 0; index < max; index++) {
            let k = p[index];
            if (o[k] == null) return null;
            o = o[k];
        }
        return o;
    }

    /**
     *
     * @param data Object
     * @param path ['a','b','c']
     * @param def any 默认值
     */
    export function getValuePath(data: Object, path: any[], def?: any): void {
        let k = path.join('.');
        return this.getValue(data, k) || def
    }

    /**
     * 向object中写入值
     * @param data
     * @param path 如a.b.c
     * @param value
     */
    export function setValue(data: Object, path: string, value: any): void {
        let p = path.split('.');
        let o = data;
        let max = p.length;
        for (let index = 0; index < max; index++) {
            let k = p[index];
            if (o[k] == null) {
                if (index < max - 1) {
                    o[k] = new Object();
                    o = o[k];
                } else {
                    o[k] = value;
                }
            } else if (index < max - 1) {
                o = o[k];
            } else {
                o[k] = value;
            }
        }
    }

    /**
     *
     * @param data Object
     * @param path ['a','b','c']
     * @param value any
     */
    export function setValuePath(data: Object, path: any[], value: any): void {
        let k = path.join('.');
        this.setValue(data, k, value)
    }

    /**
     * 删除object中的值
     * @param data
     * @param path 如a.b.c
     */
    export function deleteValue(data: Object, path: string): any {
        let p = path.split('.');
        let o = data;
        let max = p.length;
        for (let index = 0; index < max; index++) {
            let k = p[index];
            if (o[k] == null) {
                return null;
            } else if (index < max - 1) {
                o = o[k];
            } else {
                let a = o[k];
                delete o[k];
                return a;
            }
        }
    }

    /**
     * 连接多个字符串
     * @param separator
     * @param strs
     */
    export function joinStrings(separator: string, ...strs: string[]): string {
        let a: string[] = [];
        strs.forEach(str => {
            if (str != null && str != '') {
                a[a.length] = str;
            }
        });
        return a.join(separator);
    }
    /**
     * 连接多个字符串，默认连接符[.]
     * @param strs
     */
    export function join(...strs: string[]): string {
        return this.joinStrings('.', ...strs);
    }

    /**
     * 将一维数组转成2维数组
     * @param array 原数组
     * @param num 子数组最大长度
     */
    export function arrayToArrays(array: any[], num: number): any[] {
        var dd = [];
        let length = Math.ceil(array.length / num);
        for (var ii = 0; ii < length; ii++) {
            dd[ii] = [];
            for (var jj = 0; jj < num; jj++) {
                dd[ii][jj] = array[ii * num + jj];
            }
        }
        return dd;
    };

    /**
     *
     * @param array
     * @param item
     * @param key
     */
    export function indexOfArray(array: any[], item: any, key: string): number {
        if (array == null) return -1;
        let len = array.length;
        for (let i = 0; i < len; i++) {
            if (array[i][key] == item || (array[i][key] == item[key] && item[key] != undefined)) {
                return i;
            }
        }
        return -1;
    }

    export function itemOfArray<T>(array: any[], value: any, key: string): T {
        let i = this.indexOfArray(array, value, key);
        if (i == -1) return null;
        return array[i];
    }

    export function addToArray(array: any[], value: any, key?: string): void {
        if (key == null && !array.includes(value)) {
            array[array.length] = value;
        } else if (key != null && this.indexOfArray(array, value, key) == -1) {
            array[array.length] = value;
        }
    }

    /**
     * 在数据后插入新数据
     * @param array
     * @param value
     */
    export function pushToArray(array: any[], value: any): void {
        if (value == null) return;
        array[array.length] = value;
    }

    export function removeFromArray(array: any[], value: any, key?: string): void {
        let i = -1;
        if (key == null) {
            i = array.indexOf(value);
        } else {
            i = this.indexOfArray(array, value, key);
        }
        if (i > -1) array.splice(i, 1);
    }

    /**
     * 获得map中key的数组
     * @param map
     */
    export function MapKeys2Array<K, T>(map: Map<K, T>): K[] {
        let a: K[] = [];
        let keys = map.keys();
        let b = keys.next();
        while (!b.done) {
            a[a.length] = b.value;
            b = keys.next();
        }
        return a;
    }

    /**
     * 获得map中value的数组
     * @param map
     */
    export function MapValues2Array<K, T>(map: Map<K, T>): T[] {
        if (map == null || map.size == 0) return [];
        let a: T[] = [];
        let values = map.values();
        let b = values.next();
        while (!b.done) {
            a[a.length] = b.value;
            b = values.next();
        }
        return a;
    }

    /**
     * 遍历kv对象
     * @param d kv对象
     * @param func return true时终止遍历
     */
    export function forEachKV(d: any, func: (k: any, v: any) => boolean) {
        if (d == null) return;
        let keys = Object.keys(d);
        for (const key of keys) {
            if (func(key, d[key]) === true) break;
        }
    }

    /**
     * 以v1为圆心从水平正x方向到v2的夹角
     * @param v1
     * @param v2
     * @returns angle角度,radian弧度
     */
    export function angleTo(v1: cc.Vec2 | cc.Vec3, v2: cc.Vec2 | cc.Vec3): { angle: number, radian: number } {
        let a = cc.v2(v2.x - v1.x, v2.y - v1.y);
        let b = a.signAngle(cc.v2(1, 0));
        return {
            'angle': (360 - b / Math.PI * 180) % 360,
            'radian': -b
        };
    }

    /**
     * 执行EventHandler
     * @param handlers
     */
    export function executeHandlers(handlers: cc.Component.EventHandler[], ...args: any[]): void {
        handlers.forEach(handler => {
            handler.emit([].concat(args, handler.customEventData));
        });
    }

    /**
     * Vec3转Vec2
     * @param v3
     */
    export function vec3ToVec2(v3: cc.Vec3): cc.Vec2 {
        return new cc.Vec2(v3.x, v3.y);
    }

    /**
     * 创建一个EventHandler
     * @param target
     * @param component
     * @param handler
     * @param arg
     */
    export function createEventHandler(target: cc.Node, component: string, handler: string, arg = ''): cc.Component.EventHandler {
        let a = new cc.Component.EventHandler();
        a.target = target;
        a.component = component;
        a.handler = handler;
        a.customEventData = arg;
        return a;
    }

    /**克隆 */
    export function clone(d: any): any {
        if (d instanceof Array) return JSON.parse(JSON.stringify(d));
        else if (d instanceof Object) return cc.instantiate(d);
        else return d;
    }

    /**
     * 等待几秒
     * @param duration 等待时长(秒)
     * @param component
     * @returns
     */
    export async function sleep(duration: number, component?: cc.Component): Promise<void> {
        if (duration <= 0) duration = cc.director.getDeltaTime();
        return new Promise<void>(resolve => {
            if (component != null) {
                component.scheduleOnce(resolve, duration);
            } else {
                window.setTimeout(resolve, duration * 1000);
            }
        });
    }

    // 两个数相除百分比
    export function twoNumPercentage2Num(min, max, maxNum) {
        if (min > max) {
            min = max;
        }
        return Math.floor(min / max * maxNum);
    }

    /**
     * 取两值之间的随机值
     * @param min
     * @param max
     */
    export function randomBetween(min: number, max: number): number {
        if (min == max) return min;
        if (min == null || max == null) return min || max;
        return Math.random() * (max - min) + min;
    }

    /**当前时间戳（秒） */
    export function timestamp(v = 0): number {
        let a = new Date(SysTime.now * 1000);
        return Math.floor(a.getTime() / 1000) + v;
    }

    /**当前时间戳（毫秒） */
    export function timestampMs(v = 0): number {
        let a = new Date(SysTime.now * 1000);
        return a.getTime() + v;
    }

    /**当前零点时间戳（秒） */
    export function zeroTimestamp(v = 0): number {
        let a = new Date(SysTime.now * 1000);
        a.setHours(0, 0, 0, 0);
        return Math.floor(a.getTime() / 1000) + v;
    }

    /**转换为当前零点时间戳（秒） */
    export function toZeroTimestamp(v: number): number {
        let a = new Date(v * 1000);
        a.setHours(0, 0, 0, 0);
        return Math.floor(a.getTime() / 1000);
    }

    /**
     * 将时间长度转成时分秒
     * @param time 时间长度，秒
     * @returns x小时x分x秒
     */
    export function time2LocalFormat(time: number): string {
        let h: number, m: number, s: number;
        h = Math.floor(time / 3600);
        m = Math.floor((time % 3600) / 60);
        s = time % 60;
        return `${h}${m}${s}`;
    }

    /**
     * 将时间长度转成时分秒
     * @param time 时间长度，秒
     * @returns x小时x分x秒
     */
    export function second2LocalString(seconds: number): string {
        let h: number, m: number, s: number;
        h = Math.floor(seconds / 3600);
        m = Math.floor((seconds % 3600) / 60);
        s = seconds % 60;
        let a = '';
        if (h > 0) a = `${h}`;
        if (m > 0) a = `${a}`;
        if (s > 0) a = `${a}`;
        return a;
    }

    /**
     * 秒转时间 10:01:01
     * @param sec 秒
     */
    export function sec2time(sec: number, formatter?: string, show0 = true) {
        // 负数不处理
        if (sec <= 0) {
            return '00:00:00'
        }
        formatter = formatter || '{h}:{m}:{s}';
        let d = Math.floor(sec / 3600 / 24);
        let h = Math.floor(sec / 3600 % 24);
        if (d > 0) {
            // todo i18n
            formatter = `{d}{h}`;
            return this.formatString(formatter, { h: h, d: d });
        }

        let m: any = Math.floor(sec / 60 % 60);
        let s: any = Math.floor(sec % 60);

        // if (h<=9){h = `0${h}`}
        if (m <= 9 && show0) { m = `0${m}` }
        if (s <= 9 && show0) { s = `0${s}` }

        return this.formatString(formatter, { h: h, m: m, s: s });
    }

    /**
     * 编辑器模式下加载资源
     * @param path
     * @param callback
     */
    export function loadAnyInEditor<T extends cc.Asset>(path: string, callback: (item: T) => void): void {
        if (!CC_EDITOR) return;
        Editor.assetdb.queryAssets(`db://assets/${path}.*`, null, (err, assetInfos) => {
            cc.assetManager.loadAny({ uuid: assetInfos[0].uuid }, (e, f: T) => {
                callback(f);
            });
        });
    }

    /**
     * 节点的世界坐标
     * @param node
     */
    export function nodeWorldPosition(node: cc.Node, out?: cc.Vec3): cc.Vec3 {
        out = out || cc.v3();
        return node.parent?.convertToWorldSpaceAR(node.position, out) || out;
    }

    /**
     * 某节点坐标转换到另一个节点内
     * @param node
     * @param otherNode
     */
    export function nodePositionInOtherNode(node: cc.Node, otherNode: cc.Node, out?: cc.Vec3): cc.Vec3 {
        out = out || cc.v3();
        let p = this.nodeWorldPosition(node, out);
        return otherNode.convertToNodeSpaceAR(p, out);
    }

    /**
     * 数组排序
     * @param arr
     * @param handler 排序方法,为空则按数字大小排序
     * @param desc 是否降序
     */
    export function sortArray(arr: Array<any>, handler?: (a: any, b: any) => number, desc = false): void {
        if (arr == null || arr.length == 0) return;
        handler = handler || function (a: number, b: number) {
            return a - b;
        };
        arr.sort((a, b) => {
            if (desc) return handler(b, a);
            return handler(a, b);
        });
    }

    /**
     * 节点在world中的rect
     * @param node
     */
    export function nodeBoundingBox(node: cc.Node, offset?: cc.Vec2, subSize?: cc.Size): cc.Rect {
        offset = offset || cc.v2();
        subSize = subSize || cc.size(0);
        let origin = cc.v3();
        origin = this.nodeWorldPosition(node, origin);
        let anchor = node.getAnchorPoint();
        let size = node.getContentSize();
        let rect = cc.rect();
        rect.height = size.height + subSize.height;
        rect.width = size.width + subSize.width;
        rect.center = cc.v2(origin.x + (0.5 - anchor.x) * size.width + offset.x, origin.y + (0.5 - anchor.y) * size.height + offset.y);
        return rect;
    }

    /**
     * 判断点是否在节点范围内
     * @param node
     */
    export function nodeContainsPoint(node: cc.Node, point: cc.Vec2, offset?: cc.Vec2, subSize?: cc.Size): boolean {
        let rect = this.nodeBoundingBox(node, offset, subSize);
        return rect.contains(point);
    }

    /**
     * 判断两个节点是否相交
     * @param node
     * @param otherNode
     * @returns
     */
    export function nodeIntersects(node: cc.Node, otherNode: cc.Node): boolean {
        let rect = this.nodeBoundingBox(node),
            rect1 = this.nodeBoundingBox(otherNode);
        return rect.intersects(rect1);
    }

    /**
     * 对象转数组
     * @param obj
     * @param keyName
     * @param valueName
     * @returns
     */
    export function object2Array(obj: any, keyName: string, valueName: string): any[] {
        if (obj == null || keyName == null || valueName == null) return null;
        let arr = new Array();
        let keys = Object.keys(obj);
        keys.forEach(key => {
            arr[arr.length] = {
                [keyName]: key,
                [valueName]: obj[key]
            };
        });
        return arr;
    }

    /**
     * 对象转数组
     * @param obj
     * @returns
     */
    export function object2List(obj: any): any[] {
        if (obj == null) return [];
        let arr = new Array();
        let keys = Object.keys(obj);
        keys.forEach(key => {
            arr[arr.length] = obj[key];
        });
        return arr;
    }

    /**
     * 根据权重随机
     * @param weight 权重数组
     * @returns 权重索引
     */
    export function weightRandom(weight: number[]): number {
        let sum = 0;
        weight.forEach(w => {
            sum += w;
        });
        let r = Math.random() * sum;
        let n = weight.length;
        let a = 0;
        for (let i = 0; i < n; i++) {
            if (weight[i] == 0) continue;
            a += weight[i];
            if (r <= a) {
                return i;
            }
        }
    }
    /**
     * 根据权重随机
     * @param weight 权重数组
     * @param key 权重值对应key
     * @returns 权重索引
     */
    export function weightRandomObject(weight: any[], key: string): number {
        let a: number[] = [];
        weight.forEach(item => {
            a[a.length] = Number(item[key]);
        });
        return this.weightRandom(a);
    }

    /**
     * 解析缓动动效数据
     * @param data
     * @param node
     * @returns cc.Tween
     * @example  data = {
     *      delay?: 1,
     *      duration?: 1,
     *      to_by?: 'to',
     *      props?: {
     *          x: 100,
     *          y: 100
     *      },
     *      easing?: 'quadIn',
     *      repeat?: 0
     * }
     * @如果data为一维数组，则为串行动作；如果为多维数组，则数组间为并行动作，数组内为串行。
     * 默认属性变化为to
     */
    export function parseTweenData(data: any, node: cc.Node): cc.Tween<cc.Node> {
        if (!data || !node) return null;

        if (data instanceof Array) {
            let a: cc.Tween<cc.Node>[] = [];
            let isParallel = false;
            data.forEach(td => {
                if (td instanceof Array) isParallel = true;
                a[a.length] = parseTweenData(td, node);
            });

            let tween = cc.tween(node);
            if (a.length == 1) {
                tween = a[0];
            } else {
                if (!isParallel) {
                    let c = cc.tween(node);
                    c = c.sequence(a.shift(), a.shift());
                    a.forEach(b => {
                        c = cc.tween(node).sequence(c, b);
                    });
                    tween = c;
                } else {
                    let c = cc.tween(node);
                    c = c.parallel(a.shift(), a.shift());
                    a.forEach(b => {
                        c = cc.tween(node).parallel(c, b);
                    });
                    tween = c;
                }
            }
            return tween;
        } else {
            let tween = cc.tween(node);
            if (data.delay > 0) {
                tween = tween.delay(data.delay);
            }
            if (data.props != null) {
                if (data.to_by == 'by') {
                    tween = tween.by(data.duration, data.props, { easing: data.easing });
                } else {
                    tween = tween.to(data.duration, data.props, { easing: data.easing });
                }
            }
            if (data.repeat != undefined) {
                tween = tween.repeat(data.repeat || 999);
            }
            return tween;
        }
    }

    /**
     * 解析url传参
     * @returns kv对象
     */
    export function parseUrlArgs(): any {
        let query = window.location.search.substring(1);
        if (query.indexOf('&') == -1) query = window.atob(query)
        let vars = query.split("&");
        let args = new Object();
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            args[pair[0]] = pair[1];
        }
        return args;
    }

    /**
     * 注解 用于向类中添加元数据.
     * @param key 元数据key
     * @param value 元数据值
     * @returns
     */
    export function addMeta(key: string, value: string) {
        return function (target: Function) {
            target.prototype[key] = value;
        };
    }

    /**基础数据类 */
    export class Data {

        private _data: any;

        public get data(): any {
            return this._data;
        }

        public set data(v: any) {
            this._data = v;
        }

        /**转成json string */
        public get json(): string {
            return JSON.stringify(this._data);
        }

        /**将json string转成data */
        public set json(v: string) {
            this._data = JSON.parse(v);
        }

        /**
         * 读
         * @param path
         */
        public get(paths?: string | string[]): any {
            if (this._data == null) return null;
            if (paths == null || paths == '*') return this._data;
            paths = [].concat(paths);
            if (paths.length == 1) {
                return no.getValue(this._data, paths[0]);
            } else {
                let a = new Object();
                for (const k of paths) {
                    let p = k.split('.');
                    a[p[p.length - 1]] = no.getValue(this._data, k);
                }
                return a;
            }
        }
        /**
         * 写
         * @param path
         * @param value 如果value为null，则不处理
         */
        public set(path: string, value: any) {
            if (this._data == null) {
                this._data = {};
            }
            if (value instanceof Object && value['constructor'] === Object) {
                if (Object.keys(value).length == 0) {
                    no.setValue(this._data, path, value);
                } else {
                    no.forEachKV(value, (key, v) => {
                        this.set(path + '.' + key, v);
                        return false;
                    });
                }
            } else {
                no.setValue(this._data, path, value);
            }
        }

        /**
         * 删
         * @param path
         */
        public delete(path: string): any {
            if (this._data == null) return null;
            return no.deleteValue(this._data, path);
        }

        public clear(): void {
            this._data = {};
        }

        /**
         * 枚举
         * @param hander
         */
        public enumerate(hander: (k: string, v: any) => void) {
            for (const key in this._data) {
                hander(key, this._data[key]);
            }
        }
    }

    /**
     * 数据缓存类，包括localstorage、json配置、全局临时数据
     */
    class DataCache extends cc.SystemEvent {
        private _json: Data;
        private _tmp: Data;

        constructor() {
            super();
            this._json = new Data();
            this._tmp = new Data();
        }

        /**
         * 获取本地数据
         * @param key
         */
        public getLocal(key: string): any {
            let a = localStorage.getItem(key);
            if (a == null) return null;
            return JSON.parse(a);
        }
        /**
         * 写入本地数据
         * @param key
         * @param value
         */
        public setLocal(key: string, value: any): void {
            localStorage.setItem(key, JSON.stringify(value));
            this.emit(key, value);
        }

        /**
         * 获取配置数据
         * @param path 如a.b.c 或[a,b,c]
         */
        public getJSON(path?: string | string[]): any {
            return this._json.get(path);
        }

        /**
         * 写入配置数据
         * @param json
         */
        public setJSON(json: Object): void {
            forEachKV(json, (key, value) => {
                this._json.set(key, value);
                return false;
            });
        }
        /**
         * 获取全局临时数据
         * @param key
         */
        public getTmpData(key: string): any {
            return { [key]: this.getTmpValue(key) };
        }
        /**
         * 获取全局临时数据值
         * @param key
         */
        public getTmpValue(key: string): any {
            return this._tmp.get(key);
        }
        /**
         * 写入全局临时数据
         * @param key
         * @param value
         */
        public setTmpValue(key: string, value: any): void {
            if (value == null) {
                this._tmp.delete(key);
            } else {
                this._tmp.set(key, clone(value));
            }
            this.emit(key, value);
        }
    }

    /**全局数据缓存单例 */
    export let dataCache = new DataCache();


    /**资源管理 */

    class AssetPath {
        public bundle: string;
        public file: string;
        public type: typeof cc.Asset;

        constructor(bundle?: string, file?: string, type?: typeof cc.Asset) {
            this.bundle = bundle;
            this.file = file;
            this.type = type;
        }
    }
    class AssetBundleManager {

        private needReleaseAssets: cc.Asset[] = [];

        public constructor() {
            //用于设置下载的最大并发连接数，若当前连接数超过限制，将会进入等待队列。
            cc.assetManager.downloader.maxConcurrency = 10;
            //用于设置每帧发起的最大请求数，从而均摊发起请求的 CPU 开销，避免单帧过于卡顿
            cc.assetManager.downloader.maxRequestsPerFrame = 10;
            cc.assetManager.downloader.maxRetryCount = 10;
        }

        /**
         * 预加载bundles
         * @param paths
         * @param onProgress
         */
        public loadBundles(paths: string[], onProgress: (progress: number) => void): void {
            if (paths == null) {
                onProgress && onProgress(1);
                return;
            }
            this._loadB(paths, 0, onProgress);
        }

        private _loadB(paths: string[], i: number, callback: (p: number) => void) {
            let p = paths[i];
            let n = paths.length;
            this.loadBundle(p, () => {
                i++;
                callback && callback(i / n);
                i < n && this._loadB(paths, i, callback);
            });
        }
        /**
         * 预加载files
         * @param bundleName
         * @param filePaths
         * @param onProgress
         */
        public preloadFiles(bundleName: string, filePaths: string[], onProgress: (progress: number) => void): void {
            let bundle = this.getBundle(bundleName);
            if (bundle == null) {
                this.loadBundle(bundleName, () => {
                    this.preloadFiles(bundleName, filePaths, onProgress);
                });
            } else {
                bundle.preload(filePaths, cc.Asset, (finished, total, requestItem) => {
                    onProgress && onProgress(finished / total);
                }, (err, items) => {
                    if (items == null || items.length == 0) {
                        onProgress && onProgress(1);
                        no.log(err.message);
                    }
                });
            }
        }

        /**
         * 预加载场景
         * @param name
         * @param onProgress
         */
        public preloadScene(name: string, onProgress: (progress: number) => void): void {
            cc.director.preloadScene(name, (finished, total, item) => {
                // onProgress && onProgress((finished / total) || 0);
            }, (err) => {
                if (err) {
                    no.log(err.message);
                } else {
                    onProgress && onProgress(1);
                }
            });
        }
        /**
         * 加载bundle
         * @param name
         * @param callback
         */
        public loadBundle(name: string, callback: () => void): void {
            let bundle = this.getBundle(name);
            if (bundle != null) {
                callback && callback();
                return;
            }
            cc.assetManager.loadBundle(name, (err, b) => {
                if (err != null) {
                    no.log(err.message);
                } else {
                    callback && callback();
                }
            });
        }
        /**
         * 获取已加载的bundle
         * @param name
         */
        public getBundle(name: string): cc.AssetManager.Bundle {
            return cc.assetManager.getBundle(name);
        }

        /**
         * 通用资源加载
         * @param path
         * @param type
         * @param callback
         */
        public loadFile(path: string, type: typeof cc.Asset, callback: (asset: cc.Asset) => void): void {
            let p = this.assetPath(path);
            this.load(p.bundle, p.file, type, (asset: cc.Asset) => {
                callback(asset);
            });
        }
        /**
         * 加载bundle中的文件
         * @param bundleName
         * @param fileName
         * @param type
         * @param callback
         */
        private load(bundleName: string, fileName: string, type: typeof cc.Asset, callback: (asset: cc.Asset) => void): void {
            if (bundleName == null || bundleName == '') {
                cc.assetManager.loadAny({ 'url': fileName, 'type': type }, (err, item) => {
                    if (item == null) {
                        no.log(err.message);
                    } else {
                        this.addRef(item);//增加引用计数
                        callback && callback(item);
                    }
                });
            }
            else {
                let bundle = this.getBundle(bundleName);
                if (bundle != null) {
                    bundle.load(fileName, type, (err, item) => {
                        if (item == null) {
                            no.log(err.message);
                        } else {
                            this.addRef(item);//增加引用计数
                            callback && callback(item);
                            this.loadDepends(item['_uuid']);
                        }
                    });
                } else {
                    this.loadBundle(bundleName, () => {
                        this.load(bundleName, fileName, type, callback);
                    });
                }
            }
        }

        public loadText(path: string, callback: (item: cc.TextAsset) => void): void {
            this.loadFile(path, cc.TextAsset, callback);
        }

        public loadJSON(path: string, callback: (item: cc.JsonAsset) => void): void {
            this.loadFile(path, cc.JsonAsset, callback);
        }

        public loadSprite(path: string, callback: (item: cc.SpriteFrame) => void): void {
            this.loadFile(path, cc.SpriteFrame, callback);
        }

        public loadSpine(path: string, callback: (item: sp.SkeletonData) => void): void {
            this.loadFile(path, sp.SkeletonData, callback);
        }

        public loadAtlas(path: string, callback: (item: cc.SpriteAtlas) => void): void {
            this.loadFile(path, cc.SpriteAtlas, callback);
        }

        public loadTexture(path: string, callback: (item: cc.Texture2D) => void): void {
            this.loadFile(path, cc.Texture2D, callback);
        }

        public loadAudio(path: string, callback: (item: cc.AudioClip) => void): void {
            this.loadFile(path, cc.AudioClip, callback);
        }

        public loadPrefab(path: string, callback: (item: cc.Prefab) => void): void {
            this.loadFile(path, cc.Prefab, callback);
        }

        public loadAnimationClip(path: string, callback: (item: cc.AnimationClip) => void): void {
            this.loadFile(path, cc.AnimationClip, callback);
        }

        public loadTiledMap(path: string, callback: (item: cc.TiledMapAsset) => void): void {
            this.loadFile(path, cc.TiledMapAsset, callback);
        }

        public loadMaterial(path: string, callback: (item: cc.Material) => void): void {
            this.loadFile(path, cc.Material, callback);
        }

        // public loadDragonBonesAtlasAsset(path: string, callback: (item: dragonBones.DragonBonesAtlasAsset) => void): void {
        //     this.loadFile(path, dragonBones.DragonBonesAtlasAsset, callback);
        // }

        // public loadDragonBonesAsset(path: string, callback: (item: dragonBones.DragonBonesAsset) => void): void {
        //     this.loadFile(path, dragonBones.DragonBonesAsset, callback);
        // }

        public loadFiles<T extends cc.Asset>(bundleName: string, filePaths: string[], onProgress: (progress: number) => void, onComplete: (items: T[]) => void): void {
            let bundle = this.getBundle(bundleName);
            bundle.load<T>(filePaths, (finished, total, requestItem) => {
                onProgress && onProgress(finished / total);
            }, (err, items) => {
                if (items == null || items.length == 0) {
                    onProgress && onProgress(0);
                    no.log(err.message);
                } else {
                    items.forEach(item => {
                        this.addRef(item);//增加引用计数
                        this.loadDepends(item['_uuid']);
                    });
                    onComplete && onComplete(items);
                }
                no.log('loadFiles', items);
            });
        }
        /**
         * 加载场景
         * @param name
         * @param callback
         */
        public loadScene(name: string, callback: () => void): void {
            cc.director.loadScene(name, callback);
        }

        /**
         * 从服务器加载文件
         * @param url
         * @param callback
         */
        public loadRemoteFile<T extends cc.Asset>(url: string, callback: (file: T) => void) {
            cc.assetManager.loadRemote<T>(url, (err, file) => {
                if (file == null) {
                    no.log(err.message);
                    callback && callback(null);
                } else {
                    this.addRef(file);//增加引用计数
                    callback && callback(file);
                }
            });
        }

        public loadRemoteText(url: string, callback: (file: cc.TextAsset) => void) {
            this.loadRemoteFile<cc.TextAsset>(url, callback);
        }

        /**
         * 获取bundle路径，文件名及文件类型
         * @param path
         * @returns  `{'bundle','file','type'}
         */
        public assetPath(path: string): AssetPath {
            let p = path.split('/');
            let file = p.pop().split('.');
            let fileName = file[0],
                fileType = file[1];
            let bundle = p.shift();
            p[p.length] = fileName;
            fileName = p.join('/');
            let a = new AssetPath(bundle, fileName);
            let s: typeof cc.Asset;
            if (fileType != null) {
                switch (fileType.toLowerCase()) {
                    case 'json':
                        s = cc.JsonAsset;
                        break;
                    case 'mp3':
                        s = cc.AudioClip;
                        break;
                    case 'png':
                    case 'jpg':
                        s = cc.Texture2D;
                        break;
                    case 'prefab':
                        s = cc.Prefab;
                        break;
                    case 'atlas':
                        s = cc.SpriteAtlas;
                        break;
                    case 'tmx':
                        s = cc.TiledMapAsset;
                        break;
                }
                a.type = s;
            }
            return a;
        }

        public loadAllFilesInBundle(bundleName: string, onProgress: (progress: number) => void, onComplete: (items: cc.Asset[]) => void) {
            let bundle = this.getBundle(bundleName);
            if (bundle != null) {
                let paths = Object.keys(bundle['_config'].paths._map);
                this.loadFiles(bundleName, paths, onProgress, onComplete);
            } else {
                this.loadBundle(bundleName, () => {
                    this.loadAllFilesInBundle(bundleName, onProgress, onComplete);
                });
            }
        }

        public preloadAllFilesInBundle(bundleName: string, onProgress: (progress: number) => void) {
            let bundle = this.getBundle(bundleName);
            if (bundle != null) {
                let paths = Object.keys(bundle['_config'].paths._map);
                this.preloadFiles(bundleName, paths, onProgress);
            } else {
                this.loadBundle(bundleName, () => {
                    this.preloadAllFilesInBundle(bundleName, onProgress);
                });
            }
        }

        public loadAllFilesInFolder(folderName: string, onProgress: (progress: number) => void, onComplete: (items: cc.Asset[]) => void) {
            let p = this.assetPath(folderName);
            if (p.bundle == '') {
                no.err(`${folderName}没有设置ab包`);
                return;
            }
            p.file += '/';
            let bundle = this.getBundle(p.bundle);
            let keys = Object.keys(bundle['_config'].paths._map);
            let paths: string[] = [];
            keys.forEach(key => {
                if (key.indexOf(p.file) == 0) {
                    paths.push(key);
                }
            });
            this.loadFiles(p.bundle, paths, onProgress, onComplete);
        }

        public preloadAllFilesInFolder(folderName: string, onProgress: (progress: number) => void) {
            let p = this.assetPath(folderName);
            if (p.bundle == '') {
                no.err(`${folderName}没有设置ab包`);
                return;
            }
            p.file += '/';
            let bundle = this.getBundle(p.bundle);
            let keys = Object.keys(bundle['_config'].paths._map);
            let paths: string[] = [];
            keys.forEach(key => {
                if (key.indexOf(p.file) == 0) {
                    paths.push(key);
                }
            });
            this.preloadFiles(p.bundle, paths, onProgress);
        }

        public loadByUuid<T extends cc.Asset>(uuid: string, type: typeof cc.Asset, callback: (file: T) => void) {
            cc.assetManager.loadAny({ 'uuid': uuid, 'type': type }, (e: Error, f: T) => {
                if (e != null) {
                    no.err(e.stack);
                }
                this.addRef(f);//增加引用计数
                callback(f);
            });
        }

        public addRef(asset: cc.Asset): void {
            asset?.addRef();
        }

        public decRef(asset: cc.Asset): void {
            asset?.decRef();
        }

        /**
         * 加载依赖的资源
         * @param uuid 依赖资源的uuid数组
         */
        private loadDepends(uuid: string) {
            let a: any[] = [];
            let list = cc.assetManager.dependUtil.getDepsRecursively(uuid);
            if (list.length == 0) return;
            list.forEach(uuid => {
                a.push({ uuid: uuid });
            });
            cc.assetManager.loadAny(a, (e, item) => {
                if (item == null) no.err(e.message);
            });
        }
    }

    /**全局资源管理器 */
    export let assetBundleManager = new AssetBundleManager();

    /**缓存池 */
    class CachePool {
        private cacheMap: Map<string, any[]>;
        private cacheUseMap: Map<string, number>;

        constructor() {
            this.cacheMap = new Map<string, any[]>();
            this.cacheUseMap = new Map<string, number>();
            window.setTimeout(() => {
                this.checkClear();
            }, 60000);
        }

        /**
         * 获取缓存的对象
         * @param type
         */
        public reuse<T>(type: string): T {
            if (!this.cacheMap.has(type)) return null;
            this.cacheUseMap.set(type, no.timestamp());
            this.cacheMap.get(type).shift();
        }

        /**
         * 回收缓存对象
         * @param type
         * @param object
         */
        public recycle(type: string, object: any): void {
            if (type == null || type == '') {
                log(`${object.name}未指定回收类型，不做回收处理，直接销毁`);
                if (object instanceof cc.Node)
                    object.destroy();
                else object = null;
                return;
            }
            if (!this.cacheMap.has(type)) this.cacheMap.set(type, []);
            if (object instanceof cc.Node) {
                object.parent = null;
                object.active = false;
            }
            this.cacheMap.get(type).push(object);
        }

        public clearAll(): void {
            let types = no.MapKeys2Array(this.cacheMap);
            let n = types.length;
            for (let i = 0; i < n; i++) {
                this.clear(types[i]);
            }
        }

        public clear(type: string): void {
            if (type != null && this.cacheMap.has(type)) {
                let a = this.cacheMap.get(type).splice(1);
                a.forEach(obj => {
                    if (obj instanceof cc.Node)
                        obj.destroy();
                    else obj = null;
                });
            }
        }

        private checkClear() {
            let types = no.MapKeys2Array(this.cacheUseMap);
            let n = types.length;
            let t = no.timestamp();
            for (let i = 0; i < n; i++) {
                let type = types[i];
                if (t - this.cacheUseMap.get(type) > 60000)
                    this.clear(type);
            }
        }
    }
    /**全局缓存池 */
    export let cachePool = new CachePool();

    /**红点管理类 */
    class HintCenter {
        private event: cc.SystemEvent = new cc.SystemEvent();
        private data: Map<string, number> = new Map<string, number>();
        private timestampHit: object = new Object();

        public clear() {
            this.event.clear();
        }

        constructor() {
            setInterval(this.checkHint, 2000);
        }

        /**
         * 设置红点
         * @param type 红点类型
         * @param v v为红点数量,v>0时显示红点，否则隐藏
         */
        public setHint(type: string, v: number) {
            this.data.set(type, v);
            this.event.emit(type, v, type);
        }

        public changeHint(type: string, v: number): void {
            let a = this.getHintValue(type);
            a += v;
            if (a < 0) a = 0;
            this.setHint(type, a);
        }

        /**
         * 监听红点状态
         * @param type 红点类型
         * @param func
         * @param target
         */

        public onHint(type: string, func: Function, target: any): void {
            this.event.on(type, func, target);
            if (this.data.has(type)) {
                this.event.emit(type, this.data.get(type), type);
            }
        }

        /**
         * 移除红点状态监听
         * @param target
         */
        public offHint(target: any): void {
            this.event.targetOff(target);
        }

        /**
         * 按时间戳设置红点
         * @param type 红点类型
         * @param time 将来时间戳
         */
        public setHintTimestamp(type: string, time: number): void {
            if (time < timestamp()) {
                return;
            } else {
                if (this.timestampHit[type] == null || this.timestampHit[type] > time)
                    this.timestampHit[type] = time;
            }
        }

        public getHintValue(type: string): number {
            let n = 0;
            if (this.data.has(type)) n = this.data.get(type);
            return n;
        }

        private checkHint(): boolean {
            forEachKV(this.timestampHit, (type, value) => {
                if (value <= timestamp()) {
                    this.setHint(type, 1);
                    delete this.timestampHit[type];
                }
                return false;
            });
            return true;
        }
    }
    /**全局红点管理器 */
    export let hintCenter = new HintCenter();

    /**音频播放类 */
    class AudioManager {

        private clips: Map<string, cc.AudioClip> = new Map();
        /**
         * 背景音乐静音
         */
        public isBGMMute = false;

        /**
         * 音效静音
         */
        public isEffectMute = false;

        /**
         * 播放背景音乐
         * @param path 音频剪辑路径
         */
        public playBGM(path: string): void {
            if (this.isBGMMute) return;
            if (this.clips.has(path)) {
                let c = this.clips.get(path);
                this._playClip(c, path);
            } else {
                this.loadAndPlay(path, true);
            }
        }

        /**
         * 播放音效
         * @param path 音频剪辑路径
         */
        public playEffect(path: string): void {
            if (this.isEffectMute) return;
            if (this.clips.has(path)) {
                let c = this.clips.get(path);
                this._playClip(c, path, false);
            } else {
                this.loadAndPlay(path, false);
            }
        }

        /**
         * 异步播放
         * @param path 音频剪辑路径
         * @returns
         */
        public async playOnceAsync(path: string): Promise<void> {
            if (this.isEffectMute) return;
            if (this.clips.has(path)) {
                return new Promise<void>(resolve => {
                    let clip = this.clips.get(path);
                    let id = cc.audioEngine.playEffect(clip, false);
                    cc.audioEngine.setFinishCallback(id, resolve);
                });
            }
            return new Promise<void>(resolve => {
                this.loadAudioClip(path, clip => {
                    this.clips.set(path, clip);
                    let id = cc.audioEngine.playEffect(clip, false);
                    cc.audioEngine.setFinishCallback(id, resolve);
                });
            });
        }

        /**
         * 停止背景音乐
         */
        public stopBGM() {
            cc.audioEngine.stopMusic();
        }

        /**
         * 播放音频剪辑
         * @param clip 音频剪辑
         * @param loop 是否循环，默认true
         */
        public playClip(clip: cc.AudioClip, loop = true): void {
            this._playClip(clip, null, loop);
        }

        /**
         * 异步播放音频剪辑
         * @param clip 音频剪辑
         */
        public async playClipOnceAsync(clip: cc.AudioClip): Promise<void> {
            if (this.isEffectMute) return;
            return new Promise<void>(resolve => {
                let id = cc.audioEngine.playEffect(clip, false);
                cc.audioEngine.setFinishCallback(id, resolve);
            });
        }

        public _playClip(clip: cc.AudioClip, path?: string, loop = true): void {
            if (path && !this.clips.has(path))
                this.clips.set(path, clip);
            if (loop) {
                cc.audioEngine.playMusic(clip, true);
            } else {
                cc.audioEngine.playEffect(clip, false);
            }
        }

        private loadAndPlay(path: string, loop: boolean): void {
            this.loadAudioClip(path, clip => {
                this._playClip(clip, path, loop);
            });
        }

        private loadAudioClip(path: string, callback: (clip: cc.AudioClip) => void) {
            no.assetBundleManager.loadAudio(path, (clip) => {
                callback && callback(clip);
            });
        }
    }

    /**全局音频播放管理器 */
    export let audioManager = new AudioManager();

    /**节点管理类 */
    class NodeTargetManager {

        private tagetMap: Map<string, any> = new Map();

        /**
         * 注册节点
         * @param type 注册类型
         * @param target 目标
         */
        public register(type: string, target: any) {
            if (type == null || type == '' || target == null) return;
            this.tagetMap.set(type, target);
        }

        /**
         * 获取节点目标
         * @param type 注册类型
         * @returns 目标
         */
        public get<T>(type: string): T {
            if (type == null || type == '') return null;
            if (!this.tagetMap.has(type)) return null;
            return this.tagetMap.get(type) as T;
        }

        /**
         * 移除目标
         * @param type 注册类型
         */
        public remove(type: string) {
            if (type == null || type == '') return;
            if (this.tagetMap.has(type)) {
                this.tagetMap.delete(type);
            }
        }
    }
    /**全局节点管理类 */
    export let nodeTargetManager = new NodeTargetManager();


    let units = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
    /**用科学计数格式表示的字符串 */
    export class ScientificString {
        private _coefficient: number = 0;
        /**指数 */
        public index: number = 0;

        constructor(v?: string) {
            this.value = v;
        }

        public static get new(): ScientificString {
            return new ScientificString();
        }

        public set value(v: string) {
            if (v == null) return;
            if (typeof (v) == 'number') {
                console.error('科学计数不能为数字', v);
                return;
            }
            if (v != null && v != '') {
                v = v.toUpperCase();
                if (!v.includes('E')) {
                    v = Number(v).toExponential().toUpperCase();
                }
                let e = v.split('E');
                this._coefficient = Number(e[0]);
                this.index = Number(e[1]);
            }
        }

        public get value(): string {
            return `${this._coefficient}E+${this.index}`;
        }

        /**系数 */
        public get coefficient(): number {
            return this._coefficient;
        }

        /**系数 */
        public set coefficient(v: number) {
            if (v == 0 || v == null) {
                this._coefficient = 0;
                this.index = 0;
            } else {
                let e = v.toExponential().toUpperCase().split('E');
                this._coefficient = Number(e[0]);
                this.index += Number(e[1]);
            }
        }

        /**
         * 复制
         */
        public get clone(): ScientificString {
            let a = ScientificString.new;
            a._coefficient = this.coefficient;
            a.index = this.index;
            return a;
        }

        /**
         * 复制成目标
         */
        public cloneTo(other: ScientificString) {
            if (other == null) return;
            this._coefficient = other._coefficient;
            this.index = other.index;
        }

        /**加 */
        public add(other: ScientificString): void {
            if (other == null) return;
            if (this.index == other.index) {
                this.coefficient += other._coefficient;
            } else {
                this.coefficient += other._coefficient * Math.pow(10, other.index - this.index);
            }
        }

        /**加 */
        public static add(s1: string, s2: string, out?: ScientificString): ScientificString {
            out = out || new ScientificString();
            out.value = s1;
            let sc2 = new ScientificString(s2);
            out.add(sc2);
            return out;
        }

        /**减 */
        public minus(other: ScientificString): void {
            if (other == null) return;
            if (this.index == other.index) {
                this.coefficient -= other._coefficient;
            } else {
                this.coefficient -= other._coefficient * Math.pow(10, other.index - this.index);
            }
        }

        /**减 */
        public static minus(s1: string, s2: string, out?: ScientificString): ScientificString {
            out = out || new ScientificString();
            out.value = s1;
            let s = new ScientificString(s2);
            out.minus(s);
            return out;
        }

        /**乘 */
        public mul(other: ScientificString): void {
            if (other == null) return;
            this.coefficient *= other._coefficient;
            this.index += other.index;
        }

        /**乘 */
        public static mul(s1: string, s2: string, out?: ScientificString): ScientificString {
            out = out || new ScientificString();
            out.value = s1;
            let s = new ScientificString(s2);
            out.mul(s);
            return out;
        }

        /**除 */
        public div(other: ScientificString): void {
            if (other == null) return;
            this.coefficient /= other._coefficient;
            this.index -= other.index;
        }

        /**除 */
        public static div(s1: string, s2: string, out?: ScientificString): ScientificString {
            out = out || new ScientificString();
            out.value = s1;
            let s = new ScientificString(s2);
            out.div(s);
            return out;
        }

        /**
         * 值比较
         * @param other
         * @returns 负值：小于，0：等于，正值：大于
         */
        public compareTo(other: ScientificString): number {
            if (other == null) return 1;
            if (this.index == other.index) {
                return this.coefficient - other.coefficient;
            } else {
                return this.index > other.index ? 1 : -1;
            }
        }

        /**
         * 值比较
         * @param s1
         * @param s2
         * @returns 负值：小于，0：等于，正值：大于
         */
        public static compareTo(s1: string, s2: string): number {
            if (s1 == null) return -1;
            if (s2 == null) return 1;
            let e1 = new ScientificString(s1),
                e2 = new ScientificString(s2);
            return e1.compareTo(e2);
        }

        /**带单位的值 */
        public get unitValue(): string {
            if (this.index < 3) {
                return `${Math.floor(this._coefficient * Math.pow(10, this.index))}`;
            }
            let a = Math.floor(this.index / 3),
                b = this.index % 3,
                u: string;
            if (a < 4) {
                u = ["k", "m", "b"][a - 1];
            } else {
                u = this.getUnit(a - 3);
            }
            return `${Math.floor(this._coefficient * Math.pow(10, b + 2)) / 100}${u}`;
        }

        public getUnit(a: number): string {
            let u: string;
            let len = units.length;
            a -= 1;
            if (a < len)
                u = units[a];
            else {
                let c = Math.floor(a / len);
                u = units[a % len];
                u = this.getUnit(c) + u;
            }
            return u;
        }

        public get numberValue(): number {
            return this._coefficient * Math.pow(10, this.index);
        }
    }

    /**关系查询 */
    export class RelationQuery {

        private expMap: Map<string, { k: string, symbol: string, v: any }>;
        private _tableDatas: any;

        public static get new(): RelationQuery {
            return new RelationQuery();
        }

        constructor() {
            this.expMap = new Map<string, { k: string, symbol: string, v: any }>();
        }

        /**
         * 单表查询
         * @param expression 表达式，如'tableName1[.?] where keyA==1 and keyB != 2 or keyC > 3 and keyD <= (tableName2.keyE:keyF ?= "bb")'
         * @param tableDatas 表数据，{tableName:data}
         */
        public select(expression: string, tableDatas: any): any {
            let a = this.selectList(expression, tableDatas) || [];
            return a.length <= 1 ? a[0] : a;
        }

        public selectList(expression: string, tableDatas: any): any[] {
            this._tableDatas = tableDatas;
            expression = this.parseBrackets(expression);
            let arr = [];
            let idx = expression.indexOf(' where ');
            let table = expression.substring(0, idx == -1 ? expression.length : idx).split('.');
            let tableData = tableDatas[table[0]];
            if (idx > -1) {
                let query = expression.substring(idx + 1);
                let queryies = this.parseOr(query);
                forEachKV(tableData, (key, value) => {
                    if (this.checkConditions(value, queryies))
                        arr.push(value);
                    return false;
                });
            } else {
                forEachKV(tableData, (key, value) => {
                    arr.push(value);
                    return false;
                });
            }

            if (table[1] != null && arr.length >= 1) {
                let b = [];
                arr.forEach(a => {
                    b.push(this.getQueryValue(a, table[1]));
                });
                return b;
            } else if (table[1] == null) {
                return arr;
            }
        }

        private getQueryValue(tableData: any, keys: string): any {
            keys = keys.replace(new RegExp('\\[|\\]', 'g'), '');
            let a = keys.split(',');
            if (a.length == 1) return tableData[a[0]];
            let b: any = {};
            a.forEach(k => {
                b[k] = tableData[k];
            });
            return b;
        }

        private parseOr(str: string): string[][] {
            let queryies: string[][] = [];
            let ands = str.split(' or ');
            ands.forEach(and => {
                queryies.push(this.parseAnd(and));
            });
            return queryies;
        }

        private parseAnd(str: string): string[] {
            return str.split(' and ');
        }

        private parseBrackets(exp: string): string {
            if (!exp.includes('(') && !exp.includes(')')) return exp;
            let i1 = exp.indexOf('('),
                i2 = exp.lastIndexOf(')');
            let sub = exp.substring(i1 + 1, i2);
            let a = this.select(sub, this._tableDatas);
            return exp.replace(exp.substring(i1, i2 + 1), String(a));
        }

        /**判断或 */
        private checkConditions(d: any, conditions: string[][]): boolean {
            if (conditions != null) {
                let n = conditions.length;
                for (let i = 0; i < n; i++) {
                    let condition = conditions[i];
                    if (this.check(d, condition)) return true;
                }
                return false;
            } else {
                return true;
            }
        }

        /**判断与 */
        private check(d: any, conditions: string[]): boolean {
            let n = conditions.length;
            for (let i = 0; i < n; i++) {
                let condition = conditions[i];
                let exp = this.condition2Express(condition);

                let b: boolean;
                switch (exp.symbol) {
                    case '==':
                        b = d[exp.k] == exp.v;
                        break;
                    case '!=':
                        b = d[exp.k] != exp.v;
                        break;
                    case '>=':
                        b = d[exp.k] >= exp.v;
                        break;
                    case '<=':
                        b = d[exp.k] <= exp.v;
                        break;
                    case '>':
                        b = d[exp.k] > exp.v;
                        break;
                    case '<':
                        b = d[exp.k] < exp.v;
                        break;
                    case '?=':
                        b = (d[exp.k] as string).includes(exp.v);
                        break;
                }
                if (!b) return false;
            }
            return true;
        }

        private condition2Express(condition: string): { k: string, symbol: string, v: any } {
            if (this.expMap.has(condition)) return this.expMap.get(condition);

            let r = { k: '', symbol: '', v: null };
            condition = condition.trim();
            if (condition.includes('==')) {
                r.symbol = '==';
                let a = condition.split('==');
                r.k = a[0];
                r.v = a[1];
            } else if (condition.includes('!=')) {
                r.symbol = '!=';
                let a = condition.split('!=');
                r.k = a[0];
                r.v = a[1];
            } else if (condition.includes('>=')) {
                r.symbol = '>=';
                let a = condition.split('>=');
                r.k = a[0];
                r.v = Number(a[1]);
            } else if (condition.includes('<=')) {
                r.symbol = '<=';
                let a = condition.split('<=');
                r.k = a[0];
                r.v = Number(a[1]);
            } else if (condition.includes('>')) {
                r.symbol = '>';
                let a = condition.split('>');
                r.k = a[0];
                r.v = Number(a[1]);
            } else if (condition.includes('<')) {
                r.symbol = '<';
                let a = condition.split('<');
                r.k = a[0];
                r.v = Number(a[1]);
            } else if (condition.includes('?=')) {
                r.symbol = '?=';
                let a = condition.split('?=');
                r.k = a[0];
                r.v = a[1];
            }
            this.expMap.set(condition, r);
            return r;
        }
    }

    class Database {
        private _tables: any;

        constructor() {
            this._tables = new Object();
        }

        /**
         * 设置表
         * @param name 表名
         * @param data 数据
         */
        public setTable(name: string, data = {}) {
            this._tables[name] = data;
        }

        /**
         * 查表
         * @param tableNames [表名]
         * @param expression RelationQuery的查询表达式
         * @returns
         */
        public select(tableNames: string[], expression: string): any {
            let datas = {};
            tableNames.forEach(n => {
                datas[n] = this._tables[n];
            });
            return RelationQuery.new.select(expression, datas);
        }

        /**
         * 向表增加一条数据
         * @param tableName 表名
         * @param id
         * @param value
         * @returns
         */
        public insert(tableName: string, id: string | number, value: any): any {
            this._tables[tableName] = this._tables[tableName] || {};
            this._tables[tableName][id] = value;
            return this._tables[tableName];
        }

        /**
         * 删除表中某条数据
         * @param tableName 表名
         * @param id
         * @returns
         */
        public delete(tableName: string, id: string | number): any {
            if (!this._tables[tableName]) return null;
            let a = this._tables[tableName][id];
            delete this._tables[tableName][id];
            return a;
        }

        /**
         * 更新表中某条数据
         * @param tableName 表名
         * @param path 数据访问路径,如a.b.c或[a,b,c]
         * @param value
         * @returns
         */
        public update(tableName: string, path: string | string[], value: any): any {
            if (!this._tables[tableName]) return null;
            if (typeof path == 'string')
                setValue(this._tables[tableName], path, value);
            else setValuePath(this._tables[tableName], path, value);
            return this._tables[tableName];
        }
    }
    /** 数据库单例 */
    export let database = new Database();

    /**
     * 简单的http请求
     */
    export class HttpRequest {
        private Authorization: string;

        /**
         *
         * @param author 权限认证字符串
         */
        constructor(author: string) {
            this.Authorization = author;
        }

        private httpRequest(type: string, url: string, data: string | object, cb?: (v: any) => void): void {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    let a = JSON.parse(response);
                    cb?.(a);
                } else if (xhr.readyState == 4 && xhr.status == 0) {
                    cb?.('no_server');
                }
            };
            xhr.open(type, url, true);
            if (type == 'POST') {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
            xhr.setRequestHeader('Authorization', this.Authorization);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            if (typeof data == 'object') {
                data = JSON.stringify(data);
            }
            xhr.send(data);
        }

        public get(url: string): Promise<any> {
            return new Promise<any>(resolve => {
                this.httpRequest("GET", url, null, (v: any) => {
                    resolve(v);
                });
            });
        }

        public post(url: string, data: string | object): Promise<any> {
            return new Promise<any>(resolve => {
                this.httpRequest("POST", url, data, (v: any) => {
                    resolve(v);
                });
            });
        }
    }
}
