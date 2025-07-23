import React, {Component} from 'react'
import '../App.css'
import {AiOutlineShoppingCart} from 'react-icons/ai'

class RestCafe extends Component {
  state = {
    category: '',
    fetchedData: [],
    menuItems: [],
    dishCounts: {},
    cartCount: 0,
    restaurantName: '',
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
      const restaurantName = data[0].restaurant_name
      const fetchedData = data[0].table_menu_list
      const defaultCategory = fetchedData[0]?.menu_category || ''
      this.setState({
        restaurantName,
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
    const {
      category,
      fetchedData,
      menuItems,
      dishCounts,
      restaurantName,
      cartCount,
    } = this.state

    return (
      <>
        <div className="nav-bar">
          <h1 className="cafe-heading">{restaurantName}</h1>
          <p>My orders</p>
          <div className="cart-icon">
            <AiOutlineShoppingCart />
            <p className="count">{cartCount}</p>
          </div>
        </div>

        <div className="tab-bar">
          {fetchedData.map(cat => (
            <button
              key={cat.menu_category_id}
              className={`tab-btn ${
                cat.menu_category === category ? 'active' : ''
              }`}
              onClick={() => this.onChangeCategory(cat.menu_category)}
            >
              {cat.menu_category}
            </button>
          ))}
        </div>

        <div className="items-container">
          <h2>{category}</h2>
          {menuItems.map(dish => (
            <div className="item-card" key={dish.dish_id}>
              <div className="item-details">
                <h1>{dish.dish_name}</h1>
                <p>{dish.dish_description}</p>
                <p className="calories">{dish.dish_calories} Calories</p>

                {dish.dish_Availability ? (
                  <div className="qty-controls">
                    <button onClick={() => this.decrement(dish.dish_id)}>
                      -
                    </button>
                    <p>{dishCounts[dish.dish_id] || 0}</p>
                    <button onClick={() => this.increment(dish.dish_id)}>
                      +
                    </button>
                  </div>
                ) : (
                  <p>Not Available</p>
                )}

                {dish.addonCat && dish.addonCat.length > 0 && (
                  <p className="addon-text">Customizations available</p>
                )}
              </div>
              <img
                src={dish.dish_image}
                alt={dish.dish_name}
                className="item-image"
              />
            </div>
          ))}
        </div>
      </>
    )
  }
}

export default RestCafe

