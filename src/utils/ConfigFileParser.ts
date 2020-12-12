export default class ConfigFileParser {
    private keyValues = new Map<string, string>();

    constructor(content: string) {
        content
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .split("\n")
            .forEach((item: string) => {
                const keyValue = item.split("=");
                if (keyValue.length === 2) {
                    this.keyValues.set(keyValue[0].trim(), keyValue[1].trim());
                }
            });
    }

    hasKey(key: string): boolean {
        return this.keyValues.has(key);
    }

    getValue(key: string): string | undefined {
        return this.keyValues.get(key);
    }

    getValueOrDefault(key: string, defaultValue: string): string {
        return this.keyValues.get(key) || defaultValue;
    }

    setValue(key: string, value: string) {
        this.keyValues.set(key, value);
    }

    removeValue(key: string) {
        this.keyValues.delete(key);
    }

    toString(): string {
        const items: string[] = [];
        this.keyValues.forEach((value: string, key: string) => {
            items.push(`${key}=${value}`);
        });
        return items.join("\n");
    }
}
