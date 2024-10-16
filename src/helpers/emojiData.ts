import emojiData from 'unicode-emoji-json/data-by-group.json';

export const processedEmojiData = emojiData.map(category => ({
    ...category,
    iconClass: {
        smileys_emotion: 'mdi-emoticon-happy-outline',
        people_body: 'mdi-human-greeting-variant',
        animals_nature: 'mdi-penguin',
        food_drink: 'mdi-food-apple-outline',
        travel_places: 'mdi-train-car',
        activities: 'mdi-airplane',
        objects: 'mdi-ufo-outline',
        symbols: 'mdi-wheelchair',
        flags: 'mdi-flag-outline',
    }[category.slug] || 'mdi-help-circle-outline'
}));