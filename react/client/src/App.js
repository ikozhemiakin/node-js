import React from "react";
import API from "./utils/API";
import Category from "./Category";
import { Basket } from 'react-basket';
import MyComponent from "./components/mycomponent";
export { BasketProvider, DataProvider } from './basket-provider';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            description: null
        };
    }
    render() {
        const { isLoading, name, description } = this.state;
        const { classes } = this.props;
        return (
            <div id="root">
                <BasketProvider dataProvider={new MyBasketDataProvider()}>
                </>BasketProvider>
            </div>

        );
    }
    async componentDidMount() {
        let categoryData = await API.get('/', {
            params: {
                results: 1,
                inc: 'name,description'
            }
        });
// Парсим резульатты.
        categoryData = categoryData.data.categories[0];
// Обновляем стейт и ререндерим наш компонент.
        const name = categoryData.name;
        const description = categoryData.description;
        this.setState({
            ...this.state, ...{
                isLoading: false,
                name,
                description
            }
        });
    }
}
export default App;