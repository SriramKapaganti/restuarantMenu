const items = props => {
  return (
    <>
      <Item>
        <NonorVeg alt="NonOrVeg" />
        <AboutItem>
          <ItemName>{dishName}</ItemName> <PriceTag>SAR {dishPrice}</PriceTag>
          <AboutDish>{dish}</AboutDish>
        </AboutItem>
      </Item>
    </>
  )
}
