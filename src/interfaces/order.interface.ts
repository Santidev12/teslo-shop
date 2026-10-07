
export interface Order {
    isPaid: boolean;
    id: string;
    total: number;
    itemsInOrder: number;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    transactionId: string | null;
    OrderAddress: {
        firstName: string;
        lastName: string;
    } | null;
}