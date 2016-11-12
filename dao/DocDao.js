/**************************************
 * 数据库操作类DocDao继承BaseDao
 * 2016-7-25
 **************************************/

var config = require('../config');

//基础类
var BaseDao = require('./BaseDao');

class DocDao extends BaseDao {

    getList(options, callback) {

        var page = options.page,
            limit = options.limit,
            order = options.order || -1;


        this.model.find({ is_deleted: false })
            .sort({ create_at: order })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(callback);
    }

    /**
     * 获取文章标题
     * 
     * @param {any} id
     * @param {any} callback
     * 
     * @memberOf DocDao
    
     */
    getTitleById(id, callback) {
        this.model.findOne({ _id: id }, '-_id title', function(err, post) {
            if (!post) {
                return callback(err, '');
            }
            callback(err, post.title);
        });
    }

    /**
     * 获取文章列表通过分类进行筛选
     * 
     * @param {any} category
     * @param {any} options
     * @param {any} callback
     * 
     * @memberOf DocDao
     */
    getListByCategory(category, options, callback) {

        var page = options.page,
            limit = options.limit,
            order = options.order || -1;

        this.model.find({ category: category, is_deleted: false })
            .sort({ create_at: order })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(callback);
    }

    getByIdAndUpdateVisitCount(id, callback) {
        this.model.findByIdAndUpdate({ _id: id }, { $inc: { visit_count: 1 } }, callback);
    }

    incCommentCount(id, callback = function() {}) {
        this.model.update({ _id: id }, { $inc: { comment_count: 1 } }, callback);
    }

    decCommentCount(id, callback = function() {}) {
        this.model.update({ _id: id }, { $inc: { comment_count: -1 } }, callback);
    }

    /**
     * 获取搜索结果
     * 
     * @param {any} key
     * @param {any} options
     * @param {any} callback
     * 
     * @memberOf DocDao
    
     */
    getSearchResult(key, options, callback) {

        var page = options.page,
            limit = options.limit,
            order = options.order || -1;

        this.model.find({ title: { $regex: key }, is_deleted: false })
            .sort({ create_at: order })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(callback);
    }

    /**
     * 获取文章标题包含key的总数目
     * 
     * @param {any} key
     * @param {any} callback
     * 
     * @memberOf DocDao
     */
    getCountByLikeKey(key, callback) {
        this.model.count({ title: { $regex: key }, is_deleted: false }, callback);
    }
    
    /**
     * 获取归档用到的数据
     * 
     * @param {any} options
     * @param {any} callback
     * 
     * @memberOf DocDao
    
     */
    getArchives(options, callback) {

        var page = options.page,
            limit = options.limit,
            order = options.order || -1;

        this.model.find({ is_deleted: false }, 'title create_at')
            .sort({ create_at: order })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(callback);
    }

    /**
     * 获取文章数量
     * 
     * @param {any} callback
     * 
     * @memberOf DocDao
     */
    count(callback) {
        this.model.count({ is_deleted: false }, callback);
    }
}
module.exports = DocDao;