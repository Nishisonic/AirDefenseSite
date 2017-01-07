$(function(){
  for(let i = 1;i <= 2;i++){
    for(let j = 1;j <= 6;j++){
      $('#f' + i + 's' + j + 'name').load('name.html');
      $('#f' + i + 's' + j + 'name').change(i * 10 + j,setStatus);
      $('#f' + i + 's' + j + 'name').change(calc);
      for(let k = 1;k <= 5;k++){
        $('#f' + i + 's' + j + 'item' + k).load('item.html');
        $('#f' + i + 's' + j + 'item' + k).change(calc);
      }
      document.getElementById('f' + i + 's' + j + 'tyku').innerHTML = 0;
      document.getElementById('f' + i + 's' + j + 'kaju').innerHTML = "0.00";
      document.getElementById('f' + i + 's' + j + 'shotDownA').innerHTML = 0;
      document.getElementById('f' + i + 's' + j + 'shotDownB').innerHTML = 0;
      document.getElementById('f' + i + 's' + j + 'total').innerHTML = 0;
    }
  }
});
function setStatus(e){
  let fleet = Math.floor(e.data / 10);
  let ship = e.data % 10;
  let target = '#f' + fleet + 's' + ship + 'name option:selected';
  let t_tyku = 'f' + fleet + 's' + ship + 'tyku';
  let tyku = $(target).data('tyku');
  document.getElementById(t_tyku).innerHTML = tyku;
  for(let i = 0;i < 5;i++){
    let t_item = '#f' + fleet + 's' + ship + 'item' + (i + 1);
    let itemIdx = fleet * (ship - 1) * 5 + i;
    let item = $(target).data('i' + (i + 1));
    $(t_item).children('[name=item]').val(item);
  }
}
function calc(e){
  let kantaiAirBonus = 0;
  // 艦隊防空値
  for(let i = 1;i <= 2;i++){
    for(let j = 1;j <= 6;j++){
      for(let k = 1;k <= 5;k++){
        let t_item = '#f' + i + 's' + j + 'item' + k + ' option:selected';
        let id = $(t_item).val();
        let tyku = $(t_item).data('tyku');
        if(tyku <= 0) continue;
        let type = $(t_item).data('type');
        let kantaiKajuValue = tyku * getKantaiItem_A(type,id);
        let kaishuBonus = getKantaiItem_B(type,id) * Math.sqrt(0);
        kantaiAirBonus += Math.floor(kantaiKajuValue + kaishuBonus);
      }
    }
  }
  kantaiAirBonus = Math.floor($('#formation').val() * Math.floor(kantaiAirBonus));
  $('#kantaiLabel').val(kantaiAirBonus);
  let cnt = 0;
  let annihilationCnt = 0;
  // 加重対空値
  for(let i = 1;i <= 2;i++){
    for(let j = 1;j <= 6;j++){
      let t_kaju = 'f' + i + 's' + j + 'kaju';
      let t_shotDownA = 'f' + i + 's' + j + 'shotDownA';
      let t_shotDownB = 'f' + i + 's' + j + 'shotDownB';
      let t_total = 'f' + i + 's' + j + 'total';
      let t_name = '#f' + i + 's' + j + 'name option:selected';
      let shipTyku = $(t_name).data('tyku');
      let totalItemTyku = 0;
      let sum = 0;
      for(let k = 1;k <= 5;k++){
        let t_item = '#f' + i + 's' + j + 'item' + k + ' option:selected';
        let itemTyku = $(t_item).data('tyku');
        let type = $(t_item).data('type');
        let kaishuBonus = getKansenItem_B(type,itemTyku) * Math.sqrt(0);
        totalItemTyku += itemTyku;
        sum += itemTyku * getKansenItem_A(type) + kaishuBonus;
      }
      let kaju = Math.sqrt(shipTyku + totalItemTyku) + sum;
      let kajuTotal = (kaju + kantaiAirBonus) * AIR_BATTLE_FACTOR * ENEMY_FACTOR;
      let slotNum = $('#slotNumSpinner').val();
      let a = getA(kajuTotal,0,false);
      let b = getB(kaju,slotNum,0,false);
      if($(t_name).val() != -1){
        cnt += 3;
        if(a >= slotNum) annihilationCnt++;
        if(b >= slotNum) annihilationCnt++;
        if((a + b) >= slotNum) annihilationCnt++;
        document.getElementById(t_kaju).innerHTML = (kajuTotal).toFixed(2);
        document.getElementById(t_shotDownA).innerHTML = a;
        document.getElementById(t_shotDownB).innerHTML = b;
        document.getElementById(t_total).innerHTML = a + b;
      } else {
        document.getElementById(t_kaju).innerHTML = "0.00";
        document.getElementById(t_shotDownA).innerHTML = 0;
        document.getElementById(t_shotDownB).innerHTML = 0;
        document.getElementById(t_total).innerHTML = 0;
      }
    }
    let annihilationPercent = (function(a,b){
      let c = 1 / cnt * annihilationCnt * 100;
      if(Number.isNaN(c)){
        return 100;
      }
      return c;
    })(cnt,annihilationCnt);
    $('#annihilationLabel').val(annihilationPercent.toFixed(2) + "%");
  }
}