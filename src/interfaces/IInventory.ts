export interface IInventory{
	id_inventory: number
    id_user: string
    coins: number
}

export interface IInventoryProducts{
	id_inventory_products: number
    id_product: string
    quantity: number
    id_inventory: number
}