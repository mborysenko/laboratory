Modal = function (options) {
    var modal = {
        wrapper: $('#' + options.id),
        content: null,
        useFader: (options.useFader) ? options.useFader : true
    }

    modal.init = function () {

        if (modal.useFader) {
            modal.fader = ui.getFader({ container: 'fader' });
        }

        modal.wrapper.find('a.icon-close').click(modal.close);

        // Get content box
        modal.content = modal.wrapper.find('.popup-content');

        return modal;
    }

    modal.load = function (data) {
        modal.content.html(data);

        return modal;
    }

    modal.show = function (cleaner) {
        var h = modal.wrapper.height();

        if (modal.fader) {
            modal.fader.show();
        }
        modal.clean = cleaner;
        modal.wrapper.css({'margin-top': '-' + h / 2 + 'px'}).removeClass('hidden');
    }

    modal.close = function () {
        if (modal.fader) {
            modal.fader.hide();
        }
        if (modal.clean) modal.clean();
        modal.wrapper.addClass('hidden');
    }

    return modal.init();
}
