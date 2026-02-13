/* Minimal GVariant text parser for common gdbus call outputs (MPRIS-friendly)
   Supports:
   - tuples: (a, b, c)  -> Array
   - variants: <...>    -> unwraps inner value
   - dicts: {'k': v, ...} -> Record<string, any>
   - arrays: [v, v, ...] -> Array
   - strings: '...' with \\, \', \n, \r, \t, \xNN, \uNNNN, \UNNNNNNNN
   - booleans: true/false
   - typed numbers: uint64 123, int32 -7, double 0.53, byte 0x5c
   - untyped numbers: 123, -4, 0.53, 1e-3
   Returns plain JS types:
   - string, boolean, number, bigint, null (not used), Array<any>, Record<string, any>
*/

export interface GvObject {
    [key: string]: GvValue;
}

export type GvValue = string | boolean | number | bigint | GvValue[] | GvObject;

export function parseGVariantText(text: string): GvValue {
    const p = new Parser(text);
    const v = p.parseValue();
    p.skipWs();
    if (!p.eof()) throw p.err('Trailing data');
    return v;
}

class Parser {
    private i = 0;
    constructor(private readonly s: string) {}

    eof(): boolean {
        return this.i >= this.s.length;
    }
    peek(): string {
        return this.eof() ? '\0' : this.s[this.i]!;
    }
    next(): string {
        return this.eof() ? '\0' : this.s[this.i++]!;
    }

    skipWs(): void {
        while (!this.eof()) {
            const c = this.peek();
            if (c === ' ' || c === '\n' || c === '\r' || c === '\t') this.i++;
            else break;
        }
    }

    err(msg: string): Error {
        const start = Math.max(0, this.i - 20);
        const end = Math.min(this.s.length, this.i + 20);
        return new Error(`${msg} at index ${this.i} near: ${this.s.slice(start, end)}`);
    }

    expect(c: string): void {
        const got = this.next();
        if (got !== c) throw this.err(`Expected '${c}' got '${got}'`);
    }

    parseValue(): GvValue {
        this.skipWs();
        const c = this.peek();

        if (c === '(') return this.parseTuple();
        if (c === '{') return this.parseDict();
        if (c === '[') return this.parseArray();
        if (c === '<') return this.parseVariant(); // unwrap
        if (c === "'") return this.parseString();

        if (c === '-' || this.isDigit(c)) return this.parseNumberToken();

        if (this.isAlpha(c)) return this.parseIdentifierOrTyped();

        throw this.err(`Unexpected character '${c}'`);
    }

    private parseTuple(): GvValue[] {
        this.expect('(');
        this.skipWs();
        const out: GvValue[] = [];
        if (this.peek() === ')') {
            this.next();
            return out;
        }

        while (true) {
            out.push(this.parseValue());
            this.skipWs();

            if (this.peek() === ',') {
                this.next();
                this.skipWs();
                // allow trailing comma before ')'
                if (this.peek() === ')') {
                    this.next();
                    break;
                }
                continue;
            }

            if (this.peek() === ')') {
                this.next();
                break;
            }

            throw this.err("Expected ',' or ')'");
        }
        return out;
    }

    private parseVariant(): GvValue {
        this.expect('<');
        const inner = this.parseValue();
        this.skipWs();
        this.expect('>');
        return inner;
    }

    private parseDict(): Record<string, GvValue> {
        this.expect('{');
        this.skipWs();
        const obj: Record<string, GvValue> = Object.create(null);

        if (this.peek() === '}') {
            this.next();
            return obj;
        }

        while (true) {
            this.skipWs();
            if (this.peek() !== "'") throw this.err('Dict key must be a string');
            const key = this.parseString();

            this.skipWs();
            this.expect(':');
            this.skipWs();

            const val = this.parseValue();
            obj[key] = val;

            this.skipWs();
            if (this.peek() === ',') {
                this.next();
                this.skipWs();
                // allow trailing comma
                if (this.peek() === '}') {
                    this.next();
                    break;
                }
                continue;
            }
            if (this.peek() === '}') {
                this.next();
                break;
            }
            throw this.err("Expected ',' or '}'");
        }

        return obj;
    }

    private parseArray(): GvValue[] {
        this.expect('[');
        this.skipWs();
        const out: GvValue[] = [];

        if (this.peek() === ']') {
            this.next();
            return out;
        }

        while (true) {
            out.push(this.parseValue());
            this.skipWs();

            if (this.peek() === ',') {
                this.next();
                this.skipWs();
                // allow trailing comma
                if (this.peek() === ']') {
                    this.next();
                    break;
                }
                continue;
            }
            if (this.peek() === ']') {
                this.next();
                break;
            }
            throw this.err("Expected ',' or ']'");
        }
        return out;
    }

    private parseString(): string {
        this.expect("'");
        let out = '';
        while (!this.eof()) {
            const c = this.next();
            if (c === "'") return out;
            if (c !== '\\') {
                out += c;
                continue;
            }
            if (this.eof()) throw this.err('Unterminated escape');
            const e = this.next();
            switch (e) {
                case '\\':
                    out += '\\';
                    break;
                case "'":
                    out += "'";
                    break;
                case 'n':
                    out += '\n';
                    break;
                case 'r':
                    out += '\r';
                    break;
                case 't':
                    out += '\t';
                    break;
                case 'x':
                    out += String.fromCharCode(this.readHexInt(2));
                    break;
                case 'u':
                    out += String.fromCodePoint(this.readHexInt(4));
                    break;
                case 'U':
                    out += String.fromCodePoint(this.readHexInt(8));
                    break;
                default:
                    throw this.err(`Unknown escape \\${e}`);
            }
        }
        throw this.err('Unterminated string');
    }

    private readHexInt(digits: number): number {
        let v = 0;
        for (let k = 0; k < digits; k++) {
            if (this.eof()) throw this.err('Incomplete hex escape');
            const c = this.next();
            const d = this.hexDigit(c);
            if (d < 0) throw this.err(`Bad hex digit '${c}'`);
            v = (v << 4) | d;
        }
        return v;
    }

    private hexDigit(c: string): number {
        if (c >= '0' && c <= '9') return c.charCodeAt(0) - 48;
        const lc = c.toLowerCase();
        if (lc >= 'a' && lc <= 'f') return lc.charCodeAt(0) - 87;
        return -1;
    }

    private parseIdentifierOrTyped(): GvValue {
        const ident = this.readIdent();
        if (ident === 'true') return true;
        if (ident === 'false') return false;

        // typed literal form: "<type> <value>"
        this.skipWs();
        if (this.eof()) throw this.err('Unexpected end after identifier');

        if (this.isIntType(ident)) {
            // byte can be "byte 0x5c"
            const tok = this.readNumberLikeToken(true);
            return this.parseBigIntMaybeHex(tok);
        }
        if (ident === 'double') {
            const tok = this.readNumberLikeToken(false);
            return Number(tok);
        }

        throw this.err(`Unsupported identifier/type: ${ident}`);
    }

    private isIntType(t: string): boolean {
        return (
            t === 'int16' ||
            t === 'int32' ||
            t === 'int64' ||
            t === 'uint16' ||
            t === 'uint32' ||
            t === 'uint64' ||
            t === 'byte'
        );
    }

    private parseNumberToken(): number | bigint {
        const tok = this.readNumberLikeToken(false);
        // float?
        if (tok.includes('.') || tok.includes('e') || tok.includes('E')) return Number(tok);
        return BigInt(tok);
    }

    // if allowHex=true, accept 0x... (used for byte)
    private readNumberLikeToken(allowHex: boolean): string {
        this.skipWs();
        const start = this.i;

        // hex
        if (allowHex && this.peek() === '0' && (this.s[this.i + 1] === 'x' || this.s[this.i + 1] === 'X')) {
            this.i += 2;
            while (!this.eof()) {
                const c = this.peek();
                if (this.hexDigit(c) >= 0) this.i++;
                else break;
            }
            if (this.i === start + 2) throw this.err('Expected hex digits after 0x');
            return this.s.slice(start, this.i);
        }

        // decimal/scientific
        if (this.peek() === '-') this.i++;
        while (!this.eof()) {
            const c = this.peek();
            if (this.isDigit(c) || c === '.' || c === 'e' || c === 'E' || c === '+' || c === '-') {
                this.i++;
            } else {
                break;
            }
        }
        if (this.i === start) throw this.err('Expected number');
        return this.s.slice(start, this.i);
    }

    private parseBigIntMaybeHex(tok: string): bigint {
        if (tok.startsWith('0x') || tok.startsWith('0X')) return BigInt(tok);
        return BigInt(tok);
    }

    private readIdent(): string {
        const start = this.i;
        while (!this.eof()) {
            const c = this.peek();
            if (this.isAlphaNum(c) || c === '_') this.i++;
            else break;
        }
        return this.s.slice(start, this.i);
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }
    private isAlpha(c: string): boolean {
        const lc = c.toLowerCase();
        return lc >= 'a' && lc <= 'z';
    }
    private isAlphaNum(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c);
    }
}

/*
const out =
  "(<{'mpris:trackid': <'/com/spotify/track/5OYLUabPBep5tKWkpvoBcH'>, 'mpris:length': <uint64 179882000>, 'xesam:title': <'Cold World'>, 'xesam:artist': <['Eric Reprid']>}>,)";

const parsed = parseGVariantText(out);

// gdbus call returns a tuple: ( <dict>, )
const tuple = parsed as GvValue[];
const md = tuple[0] as Record<string, GvValue>;

const title = md["xesam:title"] as string;
const artists = md["xesam:artist"] as string[];
const lengthMicros = md["mpris:length"] as bigint;

console.log({ title, artists, lengthMs: Number(lengthMicros / 1000n) });
*/
