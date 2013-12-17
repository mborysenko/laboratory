<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_search
 *
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>
<div class="lvf-search clearfix">
    <div class="lvf-search_inner">
<!--        <form action="--><?php //echo JRoute::_('index.php'); ?><!--" method="post" class="form-inline">-->
                <input id="mod-search-searchword" name="searchword" class="lvf-search_input __wide"
                       maxlength="<?php echo $maxlength ?>" type="text" value="<?php echo $text ?>"
                       onblur="if (this.value == '') this.value = '<?php echo $text ?>';"
                       onfocus="if (this.value == '<?php echo $text ?>') this.value = '';"/>
<!--            <input type="hidden" name="task" value="search"/>-->
<!--            <input type="hidden" name="task" value="search"/>-->
<!--            <input type="hidden" name="option" value="com_search"/>-->
<!--            <input type="hidden" name="Itemid" value="--><?php //echo $mitemid; ?><!--"/>-->
            <!--                --><?php //if ($button): ?>
            <!--                    <td>-->
            <!--                        <button class="lvf-search_button" onclick="this.form.searchword.focus();">-->
            <?php //echo $button_text ?><!--</button>-->
            <!--                    </td>-->
            <!--                --><?php //endif; ?>
<!--        </form>-->
    </div>
</div>
