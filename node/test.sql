/*
Navicat MySQL Data Transfer

Source Server         : 本机
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2018-09-10 16:00:50
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for rote
-- ----------------------------
DROP TABLE IF EXISTS `rote`;
CREATE TABLE `rote` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `state` tinyint(2) DEFAULT '1' COMMENT '1 有效 2 无效 默认 1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rote
-- ----------------------------
INSERT INTO `rote` VALUES ('1', '系统管理员', '拥有系统所有权限，与系统共存亡，任何人不可删除，后果自负！', '1');
INSERT INTO `rote` VALUES ('2', null, null, '1');

-- ----------------------------
-- Table structure for rote_view
-- ----------------------------
DROP TABLE IF EXISTS `rote_view`;
CREATE TABLE `rote_view` (
  `rid` int(10) unsigned NOT NULL,
  `router` int(10) unsigned NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of rote_view
-- ----------------------------
INSERT INTO `rote_view` VALUES ('1', '1');
INSERT INTO `rote_view` VALUES ('1', '2');
INSERT INTO `rote_view` VALUES ('1', '3');
INSERT INTO `rote_view` VALUES ('1', '4');

-- ----------------------------
-- Table structure for router
-- ----------------------------
DROP TABLE IF EXISTS `router`;
CREATE TABLE `router` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `desc` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `state` tinyint(2) DEFAULT '1' COMMENT '1 有效 2 无效 默认 1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of router
-- ----------------------------
INSERT INTO `router` VALUES ('1', '首页', '/index', null, '1');
INSERT INTO `router` VALUES ('2', '权限列表', '/juris/list', null, '1');
INSERT INTO `router` VALUES ('3', '角色列表', '/rote/list', null, '1');
INSERT INTO `router` VALUES ('4', '用户列表', '/user/list', null, '1');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rid` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `mobile` char(11) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `realname` varchar(255) DEFAULT NULL,
  `nikename` varchar(255) DEFAULT NULL,
  `add_time` int(11) DEFAULT NULL,
  `state` tinyint(2) DEFAULT '1' COMMENT '1 有效 2 无效 默认 1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '1', 'admin', '15652579547', '123456', '王先生', '隔壁老王', '2515', '1');
