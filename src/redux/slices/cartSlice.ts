import { FoodCategory } from '@prisma/client'
import { createSlice, createAsyncThunk, AnyAction } from '@reduxjs/toolkit'
import { AppState } from '../store/store'
import { TSCartMenuItem, TSFoodMenuItem } from '@/ts/interfaces'
import { apiCall } from '@/utils/apiUtil'
import { ApiErrorMsg } from '@/ts/interfaces'

export interface CartState {
  numOfOrderItems: number
  totalPrice: number
  order: TSCartMenuItem[]
  pendingOrderId: string | null
  confimedOrderId: string | null
  errors: ApiErrorMsg[] | null
}

interface orderDetails {
  userId: string | null
  foodItems: TSFoodMenuItem[]
  totalPrice: string
}

const initialState: CartState = {
  numOfOrderItems: 0,
  totalPrice: 0,
  order: [],
  pendingOrderId: null,
  confimedOrderId: null,
  errors: null,
}

export const generatePendingOrder = createAsyncThunk(
  'cartState/generatePendingOrder',
  async ({ userId, foodItems, totalPrice }: orderDetails): Promise<any> => {
    try {
      const res = await apiCall({
        httpMethod: 'POST',
        route: 'api/v1/order/process-order',
        body: { userId, foodItems, totalPrice },
      })
      const { data } = res
      return data
    } catch (err: any) {
      throw Error(err)
    }
  }
)

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCartItem(state, { payload }) {
      const { quantity, price } = payload

      const existingItemIndex = state.order.findIndex(
        (cartItem) => cartItem.id === payload.id
      )

      if (existingItemIndex !== -1) {
        state.order[existingItemIndex].quantity += quantity
        const itemTotal = state.order[existingItemIndex].quantity * price
        state.order[existingItemIndex].itemTotal = itemTotal
        state.numOfOrderItems += quantity
        state.totalPrice += price * quantity
        return
      }

      const item = {
        ...payload,
        quantity: quantity,
        itemTotal: +price,
      }
      state.order.push(item)

      state.numOfOrderItems += quantity
      state.totalPrice += payload.price * quantity
    },
    resetCartState(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      //---------------------------------------------------------------------
      .addCase(generatePendingOrder.pending, (state) => {
        state.errors = null
        state.confimedOrderId = null
        state.pendingOrderId = null
      })
      .addCase(generatePendingOrder.fulfilled, (state, { payload }) => {
        const orderId = payload.orderId
        state.pendingOrderId = orderId
      })
      .addCase(generatePendingOrder.rejected, (state, { error }: AnyAction) => {
        state.errors = [error.message]
        state.confimedOrderId = null
        state.pendingOrderId = null
      })

    //---------------------------------------------------------------------
  },
})

export const selectCarttSlice = (state: AppState) => state.cart

export const { addCartItem, resetCartState } = cartSlice.actions

export default cartSlice.reducer
