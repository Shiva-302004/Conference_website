import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im'; // Import ImCross for the close button
import { Link } from 'react-router-dom';

const PhotoGallery = () => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/photogallery/all`)
      .then(response => response.json())
      .then(data => setImages(data)) // Show only 6 images
      .catch(error => console.error("Error fetching images:", error));
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-4">
      <section className="mb-8 p-8 bg-white rounded-xl shadow-lg w-full  max-w-full">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 border-b-4 border-gray-600 pb-2 text-center">Photo Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative overflow-hidden cursor-pointer" onClick={() => openModal(image.imageUrl)}>
              <img
                src={image.imageUrl}
                alt="Gallery"
                className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/all-images"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Images
          </Link>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-gray-900"
              onClick={closeModal}
            >
              <ImCross />
            </button>
            {/* Image in Modal with 50% width and height */}
            <img
              src={selectedImage}
              alt="Large View"
              className="w-1/2 h-1/2 object-contain mx-auto" // 50% width and height, keeping aspect ratio
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
