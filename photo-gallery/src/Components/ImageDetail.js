import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ImageDetail.scss';

const ImageDetail = () => {
    const { id } = useParams();
    const [image, setImage] = React.useState(null);
    const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });
    const accessKey = process.env.REACT_APP_VITE_KEY_ACCESS;
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`https://api.unsplash.com/photos/${id}?client_id=${accessKey}`);
                setImage(response.data);
            } catch (error) {
                console.error('Erorr Detail', error);
            }
        };

        fetchImage();
    }, [id, accessKey]);

    const handleImageLoad = (event) => {
        setImageSize({
            width: event.target.naturalWidth,
            height: event.target.naturalHeight,
        });
    };

    if (!image) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="image-detail">
                <button className="btn-back" onClick={() => navigate(-1)}>Quay lại</button>
                <img
                    src={image.urls.regular}
                    alt={image.alt_description}
                    className="img-fluid"
                    onLoad={handleImageLoad}
                />
                <div className="text-detail">
                    <h1>Author's: {image.user.first_name} {image.user.last_name}</h1>
                    <p>Title: {image.tags[0]?.title || image.tags[1]?.title || 'No title'}</p>
                    <p>Size: {imageSize.width} x {imageSize.height} </p>
                    <p>Description: {image.alt_description || 'No description'}</p>
                    {console.log('check image', image)}
                </div>
            </div>
        </div>
    );
};

export default ImageDetail;
