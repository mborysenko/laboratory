<?php
/**
 * @package     Joomla.Site
 * @subpackage  Templates.protostar
 *
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Check modules
$showRightColumn = $this->countModules('right');
$showLeftColumn = $this->countModules('left');

// Getting params from template
$params = JFactory::getApplication()->getTemplate(true)->params;

$app = JFactory::getApplication();
$doc = JFactory::getDocument();

$this->language = $doc->language;
$this->direction = $doc->direction;

// Detecting Active Variables
$option = $app->input->getCmd('option', '');
$view = $app->input->getCmd('view', '');
$layout = $app->input->getCmd('layout', '');
$task = $app->input->getCmd('task', '');
$itemid = $app->input->getCmd('Itemid', '');

$siteName = $app->getCfg('sitename');

// Add Stylesheets
$doc->addStyleSheet('templates/' . $this->template . '/css/reset.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/normalize.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/bootstrap.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/bootstrap-responsive.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/grid.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/styles.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/main.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/menu.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/social.css');

// Add current user information
$user = JFactory::getUser();

// Logo file or site title param
if ($this->params->get('logoFile')) {
    $logo = '<img src="' . JUri::root() . $this->params->get('logoFile') . '" alt="' . $siteName . '" />';
} elseif ($this->params->get('sitetitle')) {
    $logo = '<span class="site-title" title="' . $siteName . '">' . htmlspecialchars($this->params->get('sitetitle')) . '</span>';
} else {
    $logo = '<span class="site-title" title="' . $siteName . '">' . $siteName . '</span>';
}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>"
      lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <jdoc:include type="head"/>
    <link
        href='http://fonts.googleapis.com/css?family=Roboto:400,300italic,300,100italic,100,400italic,500,500italic,700,700italic,900,900italic&subset=cyrillic-ext,latin-ext,latin'
        rel='stylesheet' type='text/css'>
    <!--[if lt IE 9]>
    <script src="<?php echo $this->baseurl ?>/media/jui/js/html5.js"></script>
    <![endif]-->
</head>

<body class="__fixed site <?php echo $option
    . ' view-' . $view
    . ($layout ? ' layout-' . $layout : ' no-layout')
    . ($task ? ' task-' . $task : ' no-task')
    . ($itemid ? ' itemid-' . $itemid : '');
?>">

<div class="hidden" id="popup-a">
    <jdoc:include type="modules" name="popup_a" style="none"/>
</div>
<div class="hidden" id="popup-b">
    <jdoc:include type="modules" name="popup_b" style="none"/>
</div>
<!-- Body -->
<div id="body" class="lvf-page">
<div class="lvf-page_wrapper clearfix">

<div class="lvf-grid_container __fill __lvf_scheme_blue">
    <div id="header" class="lvf-grid_row row-fluid">
        <div class="lvf-grid_cell span2">
            <div id="logotype">
                <?php echo $logo ?>
            </div>
            <div id="slogan">
                <span>Lessons, activities, news and networking</span>
            </div>
        </div>

        <div class="lvf-grid_cell span2">
            <div class="lvf-info">
                <div class="lvf-heading __h5">
                    <span>Call Us:</span>
                </div>
                <div class="lvf-info_content">
                    <div>+38 (068) 721 04 00</div>
                    <div>+38 (066) 322 15 65</div>
                    <div>+38 (063) 341 38 55</div>
                </div>

            </div>
        </div>

        <div class="lvf-grid_cell span2">

            <div class="lvf-info">
                <div class="lvf-heading __h5">
                    <span>Email Us:</span>
                </div>
                <div class="lvf-info_content">
                    <div>info@englishnet.com.ua</div>
                </div>
            </div>

            <div class="lvf-info">
                <div class="lvf-heading __h5">
                    <span>Use Skype:</span>
                </div>
                <div class="lvf-info_content">
                    <div>eng.ua</div>
                </div>
            </div>
        </div>

        <div class="lvf-grid_cell span2">
            <div class="lvf-info lvf-social">
                <div class="lvf-heading __h5">
                    <span>Join Us:</span>
                </div>
                <div class="lvf-social_links">
                    <a class="lvf-link __social __g-plus" href="#">G+</a>
                    <a class="lvf-link __social __fb" href="#">FB</a>
                    <a class="lvf-link __social __tw" href="#">TW</a>
                    <a class="lvf-link __social __in" href="#">IN</a>
                    <a class="lvf-link __social __ok" href="#">OK</a>
                    <a class="lvf-link __social __vk" href="#">VK</a>
                </div>
            </div>
        </div>

        <div class="lvf-grid_cell span3 offset1 clearfix">
            <div id="userpanel" class="lvf-userpanel pull-right">
                <div class="lvf-userpanel_part __upper __horizontal">
                    <jdoc:include type="modules" name="user_a" style="none"/>
                </div>
                <div class="lvf-userpanel_part __upper">
                    <jdoc:include type="modules" name="user_b" style="none"/>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="lvf-grid_container __add_border __lvf_scheme_red">

    <div id="navigation" class="lvf-grid_row row-fluid __cfx">

        <div id="menu" class="span9 __horizontal __big">
            <jdoc:include type="modules" name="menu" style="none"/>
        </div>

        <div id="search" class="span3">
            <jdoc:include type="modules" name="search" style="none"/>
        </div>
    </div>
</div>

<div id="menu-target">
    <div class="lvf-grid_container __lvf_scheme_red __fill hidden lvf-submenu_layout">
        <div class="lvf-grid_row row-fluid clearfix">
            <div class="span3">
                <ul class="lvf-menu __deeper">
                    <li class="lvf-menu_item">
                        <a href="#">Sample Materials</a>
                    </li>
                    <li class="lvf-menu_item">
                        <a href="#">Free English Level Test</a>
                    </li>
                    <li class="lvf-menu_item">
                        <a href="#">What’s Included</a>
                    </li>
                    <li class="lvf-menu_item">
                        <a href="#">Course Options</a>
                    </li>
                </ul>
            </div>

            <div class="span4 offset1">
                <dl class="lvf-idiom">
                    <dt>
                        <span>"To pick someone’s brains."</span>
                    </dt>
                    <dd>
                        To ask for information or advice from someone who knows more about a subject that you do.
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</div>

<div class="lvf-grid_container">
    <div id="banner" class="lvf-grid_row row-fluid __cfx">
        <jdoc:include type="modules" name="banner" style="none"/>
    </div>
</div>

<div class="lvf-grid_container container-fluid">
    <div class="lvf-grid_row">
        <jdoc:include type="modules" name="pathway"/>
    </div>
</div>

<div class="lvf-grid_container">
    <div class="lvf-grid_row">
        <div id="message">
            <jdoc:include type="message"/>
        </div>
    </div>
</div>
<div class="lvf-grid_container">

    <div class="lvf-grid_row">
        <div class="row-fluid clearfix">

            <?php
            $centerSpan = '';
            if (($this->countModules("left") && !$this->countModules("right")) || (!$this->countModules("left") && $this->countModules("right"))) {
                $centerSpan = "span9";
            }

            if ($this->countModules("left") && $this->countModules("right")) {
                $centerSpan = "span7";
            }
            ?>
            <?php if ($showLeftColumn): ?>
                <div class="span2">
                    <div id="right" class="lvf-sidebar">
                        <jdoc:include type="modules" name="left"/>
                    </div>
                </div>
            <?php endif ?>

            <div class="<?php echo $centerSpan ?>" class="lvf-content" id="content">
                <div id="center" class="lvf-content_inner">

                    <jdoc:include type="modules" name="center"/>

                    <jdoc:include type="component"/>

                </div>
            </div>

            <?php if ($showRightColumn): ?>
                <div class="span3">
                    <div id="right" class="lvf-sidebar">
                        <jdoc:include type="modules" name="right"/>
                    </div>
                </div>
            <?php endif ?>
        </div>

        <!--        <div class="container-fluid hidden">-->
        <!--            <div id="offerings" class="row-fluid">-->
        <!--                <div class="span3">-->
        <!---->
        <!--                    <div class="lvf-offering">-->
        <!--                        <div class="lvf-offering_title lvf-heading __h3">-->
        <!--                            <span>Lessons via Video Conference</span>-->
        <!--                        </div>-->
        <!---->
        <!--                        <div class="lvf-offering_text">-->
        <!--                            <p>-->
        <!--                                Enjoy live online English classes with real teachers at home, at your office, or-->
        <!--                                wherever there is an internet connection. No more snow, no more traffic jams, no-->
        <!--                                more crowded buses, no more large, noisy classrooms. And with EnglishNET, you can-->
        <!--                                study whenever it is convenient.-->
        <!--                            </p>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--                <div class="span3">-->
        <!---->
        <!--                    <div class="lvf-offering">-->
        <!--                        <div class="lvf-offering_title lvf-heading __h3">-->
        <!--                            <span>Choose your Price</span>-->
        <!--                        </div>-->
        <!---->
        <!--                        <div class="lvf-offering_text">-->
        <!--                            <p>-->
        <!--                                Study privately for the fastest results, or reduce the cost by studying with up to-->
        <!--                                three other students.-->
        <!--                            </p>-->
        <!--                            <a href="#">Course Options</a>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!---->
        <!--                </div>-->
        <!--                <div class="span3">-->
        <!--                    <div class="lvf-offering">-->
        <!--                        <div class="lvf-offering_title lvf-heading __h3">-->
        <!--                            <span>Optional Reading and Writing</span>-->
        <!--                        </div>-->
        <!---->
        <!--                        <div class="lvf-offering_text">-->
        <!--                            <p>-->
        <!--                                Reading and writing practice is free at EnglishNET. Every week, there are new-->
        <!--                                articles to read and comment on. Your comments are corrected by our teachers. There-->
        <!--                                are also weekly writing contests.-->
        <!--                            </p>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!---->
        <!--                </div>-->
        <!--                <div class="span3">-->
        <!--                    <div class="lvf-offering">-->
        <!--                        <div class="lvf-offering_title lvf-heading __h3">-->
        <!--                            <span>Bilingual Learning System</span>-->
        <!--                        </div>-->
        <!---->
        <!--                        <div class="lvf-offering_text">-->
        <!--                            <p>-->
        <!--                                Our system works! Understand and drill new grammar and concepts with a Ukrainian or-->
        <!--                                Russian teacher, and then practice what you have learned with a native English-->
        <!--                                teacher. You may choose only native or non-native teachers for your online English-->
        <!--                                classes if you would like.-->
        <!--                            </p>-->
        <!--                            <a href="#">Our Team</a>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!---->
        <!--                </div>-->
        <!--            </div>-->
        <!--        </div>-->
    </div>
</div>

</div>
</div>
<!-- Footer -->
<div class="lvf-bottom" id="bottom">

    <div class="lvf-grid_container container-fluid __fill __lvf_scheme_blue">
        <div id="footer" class="lvf-footer_inner lvf-grid_row row-fluid clearfix">
            <div class="lvf-grid_cell span4">
                <jdoc:include type="modules" name="footer_a" style="none"/>
            </div>
            <div class="lvf-grid_cell span4">
                <jdoc:include type="modules" name="footer_b" style="none"/>
            </div>
            <div class="lvf-grid_cell pull-right span4" id="copyright">
                <jdoc:include type="modules" name="copyright" style="none"/>
            </div>

        </div>
    </div>

</div>
<jdoc:include type="modules" name="debug" style="none"/>

<!-- Include javascript files at the bottom to prevent hanging up the page -->
<script type="text/javascript" src="<?php echo 'templates/' . $this->template . '/js/library/jquery.debug.js' ?>"></script>
<script type="text/javascript" src="<?php echo 'templates/' . $this->template . '/js/application.js' ?>"></script>
<script type="text/javascript" src="<?php echo 'templates/' . $this->template . '/js/main.js' ?>"></script>

</body>
</html>
