interface Column {
    id: 'name' | 'style' | 'ibu' | 'alcohol' | 'malts' | 'yeast';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

interface Data {
    name: string;
    style: string;
    ibu: string;
    alcohol: string;
    malts: string;
    yeast: string
}

interface BeerObject {
    alcohol: string,
    blg: string,
    brand: string,
    hop: string,
    ibu: string,
    id: Number,
    malts: string,
    name: string,
    style: string,
    uid: string,
    yeast: string
}
