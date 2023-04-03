import { FoodByCategoryInterface } from '@/ts/interfaces'
import { FoodMenuItem } from '@/components'

export const FoodSection = ({
  category,
  foodItems,
}: FoodByCategoryInterface) => {
  //----------------------------------------------------------------------------------
  const foodItemsByCategory = foodItems.map((foodItem) => {
    const { id, name, price, image } = foodItem
    const priceWithDecimal = parseInt(price.toFixed(2))
    return (
      <FoodMenuItem
        key={id}
        id={id}
        name={name}
        category={category}
        price={priceWithDecimal}
        image={image}
      />
    )
  })
  //----------------------------------------------------------------------------------

  return (
    <div className="w-screen flex items-center justify-center flex-col flex-wrap gap-5">
      <h2 className="text-2xl w-[15rem] capitalize text-center bg-primaryRed text-tertiaryGold p-3 m-3">
        {category}
      </h2>

      <div className="w-screen flex items-center justify-center flex-row flex-wrap gap-5">
        {foodItemsByCategory}
      </div>
    </div>
  )
}