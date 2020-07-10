import React from "react";
import axios from "../../axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            submit: false,
            error: "",
            loading: false,
            success: false,
            imageUpload: "",
        };
    }

    handleChange(e) {
        if (e.target.files[0]) {
            this.setState({
                image: e.target.files[0],
                imageUpload: e.target.files[0].name,
                submit: true,
            });
        }
    }

    handleSubmit() {
        let formData = new FormData();
        formData.append("image", this.state.image);
        this.setState({ loading: true });
        axios
            .post("/upload", formData)
            .then((res) => {
                this.props.setImage(res.data.image);
                this.setState({
                    submit: false,
                    loading: false,
                    success: true,
                    imageUpload: "",
                });
            })
            .catch(() => {
                this.setState({
                    error:
                        "We were unable to upload your image, please check if the size does not exceed 2 MB.",
                    submit: false,
                    loading: false,
                });
            });
    }

    render() {
        return (
            <div className="uploader__container">
                <h2>Want to change your profile image?</h2>
                {this.state.error && (
                    <p className="error">{this.state.error}</p>
                )}
                <p
                    className="uploader__back-btn"
                    onClick={() => this.props.closeModal()}
                >
                    Back
                </p>
                <div>
                    <label className="uploader__input--label" htmlFor="file">
                        {this.state.imageUpload || "UPLOAD"}
                    </label>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        className="inputfile"
                        type="file"
                        name="file"
                        id="file"
                        accept="image/*"
                        required
                    />
                </div>
                {this.state.submit && (
                    <button
                        className="uploader__input--submit-btn btn"
                        onClick={() => this.handleSubmit()}
                    >
                        Update
                    </button>
                )}
                {this.state.success && (
                    <p>Your image has been updated successfully.</p>
                )}
            </div>
        );
    }
}
