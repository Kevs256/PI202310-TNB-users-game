export interface IDeck{
	id_deck?: number
    id_user: string
}

export interface IDeckProducts{
	id_deck_products?: number
    id_product: string
    quantity: number
    type: string
    id_deck: number
}