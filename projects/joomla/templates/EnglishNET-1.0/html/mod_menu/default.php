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
?>
<?php

if ($params->get('tag_id') != null) {
    $tag = $params->get('tag_id');
}
?>

<ul class="lvf-menu __cfx"<?php if (isset($tag)) { ?> id="<?php echo $tag ?>"<?php } ?>>
    <?php foreach ($list as $i => &$item) : ?>
    <?
        $class = 'lvf-menu_item item-' . $item->id;
        if ($item->id == $active_id) {
            $class .= ' __current';
        }

        if (in_array($item->id, $path)) {
            $class .= ' __active';
        } elseif ($item->type == 'alias') {
            $aliasToId = $item->params->get('aliasoptions');
            if (count($path) > 0 && $aliasToId == $path[count($path) - 1]) {
                $class .= ' __active';
            } elseif (in_array($aliasToId, $path)) {
                $class .= ' __alias-parent-active';
            }
        }

        if ($item->type == 'separator') {
            $class .= ' __divider';
        }

        if ($item->deeper) {
            $class .= ' __has_children';
        }

        if ($item->parent) {
            $class .= ' __parent';
        }
    ?>

    <li class="<?php echo $class; ?>">
    <?php
        // Render the menu item.
        switch ($item->type) :
            case 'separator':
            case 'url':
            case 'component':
            case 'heading':
                require JModuleHelper::getLayoutPath('mod_menu', 'default_' . $item->type);
                break;

            default:
                require JModuleHelper::getLayoutPath('mod_menu', 'default_url');
                break;
        endswitch;
    ?>

    <?php // The next item is deeper. ?>
    <?php if ($item->deeper): ?>
        <div class="lvf-menu_holder __lvl0">
            <ul class="lvf-menu __deeper __fill __lvf_scheme_red">
    <?php  // The next item is shallower. ?>
    <?php  elseif ($item->shallower): ?>
    </li>
    <?php echo str_repeat('</ul></li>', $item->level_diff); ?>
    <?php // The next item is on the same level. ?>
    <?php else: ?>
    </li>
    <?php endif; ?>
    <? endforeach; ?>
</ul>
