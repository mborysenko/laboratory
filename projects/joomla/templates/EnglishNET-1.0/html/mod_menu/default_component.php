<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_menu
 *
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

// Note. It is important to remove spaces between elements.
$class = $item->anchor_css ? $item->anchor_css : '';
$title = $item->anchor_title ? 'title="' . $item->anchor_title . '" ' : '';
if ($item->menu_image) {
    $item->params->get('menu_text', 1) ?
        $linktype = '<img src="' . $item->menu_image . '" alt="' . $item->title . '" /><span class="image-title">' . $item->title . '</span> ' :
        $linktype = '<img src="' . $item->menu_image . '" alt="' . $item->title . '" />';
}
else
{
    $linktype = '<span class="lvf-menu_text">' . $item->title . '</span>';
}

if ($item->deeper) {
    $linktype .= '<span class="lvf-icon"></span>';
}

switch ($item->browserNav) :
    default:
    case 0:
        ?><a class="lvf-menu_link <?php echo $class ?>"
              href="<?php echo $item->flink; ?>" <?php echo $title; ?>><?php echo $linktype; ?></a><?php
        break;
    case 1:
        // _blank
        ?><a  class="lvf-menu_link <?php echo $class ?>" href="<?php echo $item->flink; ?>"
              target="_blank" <?php echo $title; ?>><?php echo $linktype; ?></a><?php
        break;
    case 2:
        // window.open
        ?><a class="lvf-menu_link <?php echo $class ?>" href="<?php echo $item->flink; ?>"
             onclick="window.open(this.href,'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');return false;" <?php echo $title; ?>><?php echo $linktype; ?></a>
        <?php
        break;
endswitch;
