var Clip = {};

(function(ctx) { 

  function init() {
    
    var walletAddres = document.querySelector('.wallet-address');
    console.log(walletAddres)
    walletAddres.addEventListener('click', handleWalletAddressClick, false);
    walletAddres.addEventListener('touchstart', handleWalletAddressClick, false);
    walletAddres.addEventListener('touchend', handleWalletAddressClick, false);
    walletAddres.addEventListener('mousedown', handleWalletAddressClick, false);

  }

  function handleWalletAddressClick (e) {

    var contenteditable = e.contenteditable;
    var readonly = e.readonly;
    var range = document.createRange();

    e.contenteditable = true;
    e.readonly = false;
    range.selectNodeContents(e.target);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    e.target.setSelectionRange(0, 999999);

    e.contenteditable = false;
    e.readonly = true;

    document.execCommand('copy');

  }

  function handleWalletAddressClickClone (e) {

    walletAddres.focus();

    var oldContentEditable = e.contentEditable;
    var oldReadOnly = e.readOnly;
    var range = document.createRange();

    e.contentEditable = true;
    e.readOnly = false;
    range.selectNodeContents(e.target);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    e.target.setSelectionRange(0, 999999);

    e.contenteditable = oldContentEditable;
    e.oldReadOnly = oldReadOnly;

    document.execCommand('copy');

    console.log('copied')

  }

  ctx.init = init;

})(Clip);
