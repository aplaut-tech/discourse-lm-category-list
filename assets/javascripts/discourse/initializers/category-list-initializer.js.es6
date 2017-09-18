import CategoryList from 'discourse/models/category-list';


export default {
  name: "lm-category-list",

  initialize(container) {

    CategoryList.reopenClass({
      categoriesFrom(store, result) {
        const categories = CategoryList.create();
        const list = Discourse.Category.list();

        const minCategories = result.category_list.categories.length * 0.66;

        result.category_list.categories.forEach(c => {
          if (c.parent_category_id) {
            c.parentCategory = list.findBy('id', c.parent_category_id);
          }

          if (c.subcategory_ids) {
            c.subcategories = c.subcategory_ids.map(scid => list.findBy('id', parseInt(scid, 10)));
          }

          if (c.topics) {
            c.topics = c.topics.map(t => Discourse.Topic.create(t));
          }

          c.stat = `<span class="value">${c.topics_all_time}</span>`;
          c.statTitle = I18n.t("categories.topic_sentence", { count: c.topics_all_time });
          c.pickAll = true;

          categories.pushObject(store.createRecord('category', c));
        });

        return categories;
      }
    })

  }
};
