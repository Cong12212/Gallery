import React from 'react';
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ImageComponent.scss';

class ImageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            page: 1,
            loading: false,
            hasMore: true,
        };
        this.accessKey = process.env.REACT_APP_VITE_KEY_ACCESS;
    }

    componentDidMount() {
        this.fetchImages();
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        const { loading, hasMore } = this.state;

        // Kiểm tra điều kiện trước khi thực hiện tải thêm hình ảnh
        if (loading || !hasMore) return;

        // Tính toán xem đã cuộn đến đáy của trang hay chưa
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Kiểm tra nếu đã cuộn đến đáy trang
        if (scrollTop + windowHeight >= documentHeight - 100) {
            this.setState({ loading: true }, this.fetchImages);
        }
    };

    fetchImages = async () => {
        try {
            const { page } = this.state;
            console.log(`Fetching page: ${page}`);
            const response = await axios.get(
                `https://api.unsplash.com/photos/?client_id=${this.accessKey}&per_page=20&page=${page}`
            );

            console.log(`Số hình ảnh trả về: ${response.data.length}`);
            console.log(`Headers:`, response.headers);

            const newImages = response.data.filter(
                (newImage) => !this.state.images.some((img) => img.id === newImage.id)
            );

            console.log(`Hình ảnh mới nhận được:`, newImages.length);

            if (newImages.length === 0) {
                this.setState({ hasMore: false, loading: false });
                return;
            }

            this.setState((prevState) => ({
                images: [...prevState.images, ...newImages],
                page: prevState.page + 1,
                loading: false,
            }));
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ Unsplash', error);
            this.setState({ loading: false });
        }
    };

    handleImageClick = (id) => {
        const { navigate } = this.props; // Lấy hàm navigate từ props
        navigate(`/photos/${id}`); // Đã sửa ở đây để điều hướng đến route mới
    };

    render() {
        const { images } = this.state;
        return (
            <div className="container">
                <div className="gallery">
                    {images.map((image) => (
                        <div key={image.id} className="image-item">
                            <div
                                onClick={() => this.handleImageClick(image.id)} // Sử dụng onClick để điều hướng
                                className="image-item p-2 rounded shadow"
                                style={{ cursor: 'pointer' }} // Thêm con trỏ chuột
                            >
                                <img
                                    src={image.urls.thumb}
                                    alt={image.alt_description}
                                    className="img-fluid rounded"
                                />
                                <p className="mt-2">{image.user.last_name || image.user.first_name || 'No author'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

// Wrapper component để sử dụng useNavigate
const ImageComponentWrapper = () => {
    const navigate = useNavigate(); // Lấy hàm navigate từ hook
    return <ImageComponent navigate={navigate} />; // Truyền navigate vào props
};

export default ImageComponentWrapper;
