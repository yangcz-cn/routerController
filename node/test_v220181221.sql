/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2018-12-21 11:21:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `admin_log`
-- ----------------------------
DROP TABLE IF EXISTS `admin_log`;
CREATE TABLE `admin_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '管理员操作日志 id',
  `uid` int(10) DEFAULT NULL COMMENT '用户id',
  `type` tinyint(2) DEFAULT NULL COMMENT '日志类型 1 登录 2 查看信息 3 修改信息 4 删除信息 5 新增数据',
  `action` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '操作名称',
  `data` text CHARACTER SET utf8 COMMENT '操作数据',
  `ip` char(20) CHARACTER SET utf8 DEFAULT NULL COMMENT '操作 ip',
  `add_time` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `类型` (`type`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=latin1 COMMENT='管理员操作日志表';

-- ----------------------------
-- Records of admin_log
-- ----------------------------

-- ----------------------------
-- Table structure for `rote`
-- ----------------------------
DROP TABLE IF EXISTS `rote`;
CREATE TABLE `rote` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '角色名称',
  `desc` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `state` tinyint(2) DEFAULT '1' COMMENT '1 有效 2 无效 默认 1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Records of rote
-- ----------------------------
INSERT INTO `rote` VALUES ('1', '系统管理员', '拥有系统所有权限，与系统共存亡，任何人不可删除，后果自负！', '1');
INSERT INTO `rote` VALUES ('2', '黄金会员', 'vip特权', '1');
INSERT INTO `rote` VALUES ('3', '普通用户', '大众', '1');

-- ----------------------------
-- Table structure for `rote_view`
-- ----------------------------
DROP TABLE IF EXISTS `rote_view`;
CREATE TABLE `rote_view` (
  `rid` int(10) unsigned NOT NULL COMMENT '角色id',
  `router` int(10) unsigned NOT NULL COMMENT '权限id'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='角色权限表';

-- ----------------------------
-- Records of rote_view
-- ----------------------------
INSERT INTO `rote_view` VALUES ('1', '1');
INSERT INTO `rote_view` VALUES ('1', '2');
INSERT INTO `rote_view` VALUES ('1', '3');
INSERT INTO `rote_view` VALUES ('1', '4');

-- ----------------------------
-- Table structure for `router`
-- ----------------------------
DROP TABLE IF EXISTS `router`;
CREATE TABLE `router` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '权限名称',
  `path` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '权限路由',
  `desc` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '权限描述',
  `state` tinyint(2) DEFAULT '1' COMMENT '1 有效 2 无效 默认 1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COMMENT='权限表';

-- ----------------------------
-- Records of router
-- ----------------------------
INSERT INTO `router` VALUES ('1', '首页', '/index', null, '1');
INSERT INTO `router` VALUES ('2', '权限列表', '/juris/list', null, '1');
INSERT INTO `router` VALUES ('3', '角色列表', '/rote/list', null, '1');
INSERT INTO `router` VALUES ('4', '用户列表', '/user/list', null, '1');
INSERT INTO `router` VALUES ('5', '权限添加', '/juris/add', null, '1');
INSERT INTO `router` VALUES ('6', '角色添加', '/rote/add', '用于给系统添加角色', '1');
INSERT INTO `router` VALUES ('7', '用户添加', '/user/add', '后天添加用户', '1');
INSERT INTO `router` VALUES ('8', '顶顶顶啊啊', '/ddd/ccc', '', '1');
INSERT INTO `router` VALUES ('9', '测试', '/test/ddd', '', '2');
INSERT INTO `router` VALUES ('10', 'dda', '/test/ccc', '', '1');
INSERT INTO `router` VALUES ('11', 'dda', '/test/ccc', '', '1');
INSERT INTO `router` VALUES ('12', 'dd', '/dda/cc', '', '1');
INSERT INTO `router` VALUES ('13', 'dd', '/dda/cc', 'dfafa', '1');
INSERT INTO `router` VALUES ('14', 'dasfas', '/ccc/dd', '的发放', '2');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rid` int(11) DEFAULT NULL COMMENT '角色id',
  `username` varchar(255) NOT NULL COMMENT '用户名唯一且不能改',
  `mobile` char(11) NOT NULL COMMENT '手机号',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `realname` varchar(255) DEFAULT NULL COMMENT '真实姓名',
  `nikename` varchar(255) DEFAULT NULL COMMENT '昵称',
  `source` tinyint(2) NOT NULL COMMENT '用户来源 1 后台添加 2 前台注册',
  `add_time` int(11) NOT NULL COMMENT '添加时间',
  `state` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1 有效 2 无效 默认 1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '1', 'admin', '15652579547', '123456', '王先生', '隔壁老王', '0', '2515', '1');
INSERT INTO `user` VALUES ('2', '3', 'test', '15623221594', 'ntmvt3', '', '得到', '1', '1545275597', '1');
INSERT INTO `user` VALUES ('3', '3', 'shishi', '15625959841', 'e3vy2g', '', '', '1', '1545281287', '1');
INSERT INTO `user` VALUES ('4', '3', 'dd', '15843333334', 'swov4y', '', '拉拉', '1', '1545281683', '1');
INSERT INTO `user` VALUES ('5', '1', 'ddda', '15841155325', '0pfsn7', 'kkk', '啊哈哈b', '1', '1545289435', '2');
INSERT INTO `user` VALUES ('6', '3', '111', '15623121456', 'j7yg4j', '', '', '1', '1545359077', '1');
