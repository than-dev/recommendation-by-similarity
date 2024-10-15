import { fillterUsers } from './helper.mjs';
import { calcSimilarity } from '../math/similarity.mjs';
import { createUserVector } from './helper.mjs';

import { data } from '../data.mjs';

export function recommendPosts({ userId, topN, threshold = 0 }) {
	const userVector = createUserVector(userId, data.posts, data.reads);

	const filteredUsers = applyFilters(data.users, userId);
	const similarities = calculateSimilarities(
		filteredUsers,
		userVector,
		data.posts,
		data.reads
	);
	const orderedSimilarities = applyThresholdAndSort(similarities, threshold);

	console.log('SIMILARIDADES', orderedSimilarities);

	const similarUserIds = getTopNSimilarUsers(
		orderedSimilarities,
		topN || data.users.length / 5
	);

	console.log(`USUARIOS MAIS SIMILARES AO ${userId}`, similarUserIds);

	const recommendations = getRecommendations(
		similarUserIds,
		userVector,
		data.reads
	);
	const uniqueRecommendations = removeDuplicates(recommendations);

	return mapRecommendationsToPosts(uniqueRecommendations, data.posts);
}

function applyFilters(users, userId) {
	return fillterUsers(users, userId);
}

function calculateSimilarities(users, userVector, posts, reads) {
	return users.map((user) => {
		const otherUserVector = createUserVector(user.id, posts, reads);
		return {
			userId: user.id,
			similarity: calcSimilarity(userVector, otherUserVector)
		};
	});
}

function applyThresholdAndSort(similarities, threshold) {
	return similarities
		.filter(({ similarity }) => similarity > threshold)
		.sort((a, b) => b.similarity - a.similarity);
}

function getTopNSimilarUsers(orderedSimilarities, topN) {
	return orderedSimilarities.map((sim) => sim.userId).slice(0, topN);
}

function getRecommendations(similarUserIds, userVector, reads) {
	return reads
		.filter(
			(read) =>
				similarUserIds.includes(read.userId) &&
				!userVector[read.postId - 1]
		)
		.map((read) => read.postId);
}

function removeDuplicates(recommendations) {
	return [...new Set(recommendations)];
}

function mapRecommendationsToPosts(recommendations, posts) {
	return recommendations.map((postId) =>
		posts.find((post) => post.id === postId)
	);
}
