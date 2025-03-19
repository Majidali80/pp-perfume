"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

// Define the Review interface
interface Review {
  _id: string;
  productId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

const ReviewComponent = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const query = `*[_type == "review" && productId == $productId] | order(createdAt desc) {
        _id,
        productId,
        rating,
        comment,
        userName,
        createdAt
      }`;
      try {
        const fetchedReviews = await client.fetch(query, { productId });
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment || !userName) {
      setError("Please fill in all fields, including a rating.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newReview = {
      _type: "review",
      productId,
      rating,
      comment,
      userName,
      createdAt: new Date().toISOString(),
    };

    try {
      const createdReview = await client.create(newReview);
      setReviews([createdReview, ...reviews]); // Immediately update reviews state
      setRating(0);
      setComment("");
      setUserName("");
      Swal.fire({
        icon: "success",
        title: "Review Submitted!",
        text: "Thank you for your feedback!",
        confirmButtonColor: "#C084FC",
        timer: 2000,
      });
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setError(
        err.message.includes("permission") ? "Insufficient permissions to submit review. Contact admin." : "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-gradient-to-br from-purple-700 to-purple-400 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-purple-200 mb-4">Customer Reviews</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Review List */}
        {reviews.length > 0 ? (
          <div className="space-y-6 mb-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-purple-800 p-4 rounded-lg border border-purple-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-200 font-semibold">{review.userName}</span>
                  <span className="text-gray-300 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar
                        key={i}
                        size={16}
                        color={i < review.rating ? "#C084FC" : "#4B5563"}
                        className="mr-1"
                      />
                    ))}
                </div>
                <p className="text-gray-200">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200 mb-6">No reviews yet. Be the first to review "{productId}"!</p>
        )}

        {/* Review Form */}
        <h3 className="text-xl font-semibold text-purple-200 mt-6 mb-4">Leave a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Your Rating</label>
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FaStar
                    key={i}
                    size={24}
                    color={i < rating ? "#C084FC" : "#4B5563"}
                    onClick={() => setRating(i + 1)}
                    className="cursor-pointer mr-2"
                  />
                ))}
            </div>
          </div>
          <div>
            <label className="block text-white mb-1">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 rounded-md text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 rounded-md text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
              placeholder="Write your review here..."
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-purple-400 text-white py-2 px-6 rounded-lg hover:bg-purple-500 transition duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewComponent;