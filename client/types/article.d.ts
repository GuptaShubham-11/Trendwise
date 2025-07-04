export interface Article {
    _id: string;
    title: string;
    slug: string;
    content: string;
    metaDescription: string;
    headings: string[];
    createdAt: Date;
    updatedAt: Date;
}