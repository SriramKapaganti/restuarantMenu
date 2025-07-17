import React, {Component} from 'react'
import styled from 'styled-components'
import {AiOutlineShoppingCart} from 'react-icons/ai'

// Styled Components
const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #fff8f0;
  border-bottom: 1px solid #ddd;
`

const CafeHeading = styled.h1`
  font-size: 28px;
  color: #222;
`

const CartIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  position: relative;
`

const Count = styled.span`
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 14px;
  position: absolute;
  top: -10px;
  right: -10px;
`

const TabBar = styled.div`
  display: flex;
  overflow-x: auto;
  background-color: #f5f5f5;
  padding: 12px 16px;
  gap: 12px;
`

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 20px;
  background-color: ${props => (props.active ? '#333' : '#e0e0e0')};
  color: ${props => (props.active ? '#fff' : '#000')};
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #bbb;
  }
`

const ItemsContainer = styled.div`
  padding: 24px;
`

const ItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
`

const ItemDetails = styled.div`
  flex: 1;
`

const ItemName = styled.h3`
  margin: 0 0 8px;
`

const ItemDesc = styled.p`
  margin: 0;
  color: #555;
`

const Calories = styled.span`
  font-size: 12px;
  color: orange;
  display: block;
`

const AddonText = styled.p`
  color: green;
  font-size: 14px;
`

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  margin-left: 20px;
`
const QtyControls = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`

const QtyButton = styled.button`
  background-color: #eee;
  border: none;
  font-size: 16px;
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 6px;
  margin: 0 8px;

  &:hover {
    background-color: #ccc;
  }
`

const QtyCount = styled.span`
  font-size: 16px;
`

class RestCafe extends Component {
  state = {
    category: '',
    fetchedData: [],
    menuItems: [],
    dishCounts: {},
    cartCount: 0,
  }

  componentDidMount() {
    this.callRestaurantMenuApi()
  }

  callRestaurantMenuApi = async () => {
    try {
      const response = await fetch(
        'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details',
      )
      const data = await response.json()
      const fetchedData = data[0].table_menu_list
      const defaultCategory = fetchedData[0]?.menu_category || ''
      this.setState({
        fetchedData,
        category: defaultCategory,
        menuItems: fetchedData.find(
          cat => cat.menu_category === defaultCategory,
        ).category_dishes,
      })
    } catch (error) {
      console.error('API fetch error:', error)
    }
  }

  onChangeCategory = newCategory => {
    const {fetchedData} = this.state
    const selected = fetchedData.find(cat => cat.menu_category === newCategory)
    this.setState({
      category: newCategory,
      menuItems: selected.category_dishes,
    })
  }

  increment = id => {
    this.setState(prevState => {
      const prevCount = prevState.dishCounts[id] || 0
      return {
        dishCounts: {...prevState.dishCounts, [id]: prevCount + 1},
        cartCount: prevState.cartCount + 1,
      }
    })
  }

  decrement = id => {
    this.setState(prevState => {
      const prevCount = prevState.dishCounts[id] || 0
      if (prevCount === 0) return prevState
      return {
        dishCounts: {...prevState.dishCounts, [id]: prevCount - 1},
        cartCount: prevState.cartCount - 1,
      }
    })
  }

  render() {
    const {category, fetchedData, menuItems, dishCounts, cartCount} = this.state
    console.log(cartCount)
    return (
      <>
        <NavBar>
          <CafeHeading>UNI Resto Cafe</CafeHeading>
          <CartIcon>
            <AiOutlineShoppingCart />
            <Count>{cartCount}</Count>
          </CartIcon>
        </NavBar>

        <TabBar>
          {fetchedData.map(cat => (
            <Button
              key={cat.menu_category_id}
              active={cat.menu_category === category}
              onClick={() => this.onChangeCategory(cat.menu_category)}
            >
              {cat.menu_category}
            </Button>
          ))}
        </TabBar>

        <ItemsContainer>
          <h2>{category}</h2>
          {menuItems.map(dish => (
            <ItemCard key={dish.dish_id}>
              <ItemDetails>
                <ItemName>{dish.dish_name}</ItemName>
                <ItemDesc>{dish.dish_description}</ItemDesc>
                <Calories>{dish.dish_calories} Calories</Calories>

                {dish.dish_Availability ? (
                  <QtyControls>
                    <QtyButton onClick={() => this.decrement(dish.dish_id)}>
                      -
                    </QtyButton>
                    <QtyCount>{dishCounts[dish.dish_id] || 0}</QtyCount>
                    <QtyButton onClick={() => this.increment(dish.dish_id)}>
                      +
                    </QtyButton>
                  </QtyControls>
                ) : (
                  <p>Not Available</p>
                )}
                {dish.addonCat && dish.addonCat.length > 0 && (
                  <AddonText>Customizations available</AddonText>
                )}
              </ItemDetails>
              <ItemImage src={dish.dish_image} alt={dish.dish_name} />
            </ItemCard>
          ))}
        </ItemsContainer>
      </>
    )
  }
}

export default RestCafe
