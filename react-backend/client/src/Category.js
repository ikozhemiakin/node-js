import React from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { Card } from "shards-react";
class Category extends React.Component {
    render() {
        const { name, description, isLoading } = this.props;
        const userDetails = (
            <div>
                <h4 className="mb-0">{name}</h4>
                <span className="text-muted">{description}</span>
            </div>
        );
        const loadingMessage = <span className="d-flex m-auto">Loading...</span>;
        return (
            <Card
                className="mx-auto mt-4 text-center p-5"
                style={{ maxWidth: "300px", minHeight: "250px" }}
            >
                {isLoading ? loadingMessage : userDetails}
            </Card>
        );
    }
}
Category.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
};
export default Category;