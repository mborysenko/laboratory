<?php
/**
 * @package     Joomla.Site
 * @subpackage  Templates.protostar
 *
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

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


$doc->addScript('templates/' . $this->template . '/js/application.js');
$doc->addScript('templates/' . $this->template . '/js/main.js');

// Add Stylesheets
$doc->addStyleSheet('templates/' . $this->template . '/css/reset.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/normalize.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/bootstrap.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/bootstrap-responsive.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/grid.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/styles.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/main.css');
$doc->addStyleSheet('templates/' . $this->template . '/css/menu.css');

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

<!-- Body -->
<div id="body" class="lvf-page">
    <div class="lvf-page_wrapper">

        <div class="lvf-grid_container __fill __scheme_blue">
            <div id="header" class="lvf-grid_row fluid-row">
                <div class="lvf-grid_cell span2">
                    <div id="logotype">
                        Logo
                    </div>
                    <div id="slogan">
                        <span>Lessons, activities, news and networking</span>
                    </div>
                </div>

                <div class="lvf-grid_cell span2">
                    <div>
                        <span>Call Us:</span>
                    </div>
                </div>

                <div class="lvf-grid_cell span2">
                    <div>
                        <span>Email Us:</span>
                    </div>
                    <div>
                        <span>Use Skype:</span>
                    </div>
                </div>

                <div class="lvf-grid_cell span2">
                    <div>
                        <span>We in the social networks</span>
                    </div>
                </div>

                <div class="lvf-grid_cell span2 offset2">
                    Profile
                </div>
            </div>
        </div>

        <div class="lvf-grid_container">

            <div id="navigation" class="lvf-grid_row row-fluid __cfx">

                <div id="menu" class="span9">
                    <ul class="lvf-menu __horizontal __big clearfix __upper">
                        <li class="lvf-menu_item __active">
                            <a href="#">Getting Started</a>
                        </li>
                        <li class="lvf-menu_item">
                            <a href="#">Courses</a>
                        </li>
                        <li class="lvf-menu_item">
                            <a href="#">Learn</a>
                        </li>
                        <li class="lvf-menu_item">
                            <a href="#">Practice</a>
                        </li>
                        <li class="lvf-menu_item">
                            <a href="#">About</a>
                        </li>
                    </ul>
                    <jdoc:include type="modules" name="menu" style="none"/>
                </div>

                <div id="search" class="span3">
                    Search
                    <jdoc:include type="modules" name="search" style="none"/>
                </div>

            </div>
        </div>

        <div class="lvf-grid_container">
            <div id="breadcrumbs" class="lvf-grid_row">
                <ul class="lvf-pathway">
                    <li>
                        <a class="__upper" href="#">Home</a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="lvf-grid_container">

            <div id="content" class="lvf-grid_row">

                <div class="row-fluid clearfix">
                    <div class="span9">
                        <div class="lvf-article">
                            <div class="lvf-heading __h1">
                                <span>Free Online English Level Test</span>
                            </div>
                            <div>
                                <p>
                                    To take our online level test, simply read the questions below, and answer them by pressing "Click to Record" below each question.  Then click "Allow" and begin speaking.  Please try to answer in complete sentences and be as detailed as possible.
                                </p>
                                <p>
                                    For the most accurate results, you should only make one recording per question.  When you are ready to save the recording, click "Click here to save", and then click on "Email".  The email should be sent to test@englishnet.com.ua, with the subject heading "Level Test, (your name)".  Please make sure to make a different recording for each question.
                                </p>
                                <p>
                                    After we have evaluated your answers, we will contact you with the results.  Good luck!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="span3 lvf-layout">
                        <ul class="lvf-menu clearfix __upper">
                            <li class="lvf-menu_item">
                                <a href="#">Getting Started</a>
                            </li>
                            <li class="lvf-menu_item">
                                <a href="#">Courses</a>
                            </li>
                            <li class="lvf-menu_item">
                                <a href="#">Learn</a>
                            </li>
                            <li class="lvf-menu_item">
                                <a href="#">Practice</a>
                            </li>
                            <li class="lvf-menu_item">
                                <a href="#">About</a>
                            </li>
                        </ul>
                    </div>
                </div>


                <div id="offerings" class="row-fluid hidden">
                    <div class="span3">

                        <div class="lvf-offering">
                            <div class="lvf-offering_title lvf-heading __h3">
                                <span>Lessons via Video Conference</span>
                            </div>

                            <div class="lvf-offering_text">
                                <p>
                                    Enjoy live online English classes with real teachers at home, at your office, or
                                    wherever there is an internet connection. No more snow, no more traffic jams, no
                                    more crowded buses, no more large, noisy classrooms. And with EnglishNET, you can
                                    study whenever it is convenient.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="span3">

                        <div class="lvf-offering">
                            <div class="lvf-offering_title lvf-heading __h3">
                                <span>Choose your Price</span>
                            </div>

                            <div class="lvf-offering_text">
                                <p>
                                    Study privately for the fastest results, or reduce the cost by studying with up to
                                    three other students.
                                </p>
                                <a href="#">Course Options</a>
                            </div>
                        </div>

                    </div>
                    <div class="span3">
                        <div class="lvf-offering">
                            <div class="lvf-offering_title lvf-heading __h3">
                                <span>Optional Reading and Writing</span>
                            </div>

                            <div class="lvf-offering_text">
                                <p>
                                    Reading and writing practice is free at EnglishNET. Every week, there are new
                                    articles to read and comment on. Your comments are corrected by our teachers. There
                                    are also weekly writing contests.
                                </p>
                            </div>
                        </div>

                    </div>
                    <div class="span3">
                        <div class="lvf-offering">
                            <div class="lvf-offering_title lvf-heading __h3">
                                <span>Bilingual Learning System</span>
                            </div>

                            <div class="lvf-offering_text">
                                <p>
                                    Our system works! Understand and drill new grammar and concepts with a Ukrainian or
                                    Russian teacher, and then practice what you have learned with a native English
                                    teacher. You may choose only native or non-native teachers for your online English
                                    classes if you would like.
                                </p>
                                <a href="#">Our Team</a>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>


    </div>
</div>
<!-- Footer -->
<div class="lvf-bottom">
    <div class="lvf-grid_container">
        <div id="footer" class="lvf-grid_row fluid-row">

            <div class="lvf-grid_cell span2">
                <span class="__upper">Help</span>
            </div>
            <div class="lvf-grid_cell span2">
                <span class="__upper">About</span>
            </div>
            <div class="lvf-grid_cell span2">
                <span class="__upper">Career</span>
            </div>
            <div class="lvf-grid_cell span2">
                <span class="__upper">Social</span>
            </div>
            <div class="lvf-grid_cell span2 offset2">
                Bottom logo
            </div>

            <jdoc:include type="modules" name="footer" style="none"/>
        </div>
    </div>

    <div class="lvf-grid_container __fill __scheme_blue">
        <div id="copyright" class="lvf-grid_row row-fluid">

            <div class="lvf-grid_cell span2 offset10">
                <span class="pull-right">&copy; <?php echo $siteName; ?> <?php echo date('Y'); ?></span>
            </div>

        </div>
    </div>

</div>
<jdoc:include type="modules" name="debug" style="none"/>
</body>
</html>
