import test from 'node:test';
import assert from 'node:assert/strict';
import {setLocale,getLocale,t,sample,translateMessage} from '../i18n.js';

test('English and Indonesian UI labels switch deterministically', () => {
  setLocale('id');
  assert.equal(getLocale(),'id');
  assert.equal(t('Compare options'),'Bandingkan pilihan');
  assert.equal(t('Score 0–10'),'Nilai 0–10');
  assert.equal(t('Final result 0–100'),'Hasil akhir 0–100');
  assert.equal(sample('A day by the sea'),'Sehari di pantai');
  assert.equal(translateMessage('Remove this option?'),'Hapus pilihan ini?');
  setLocale('en');
  assert.equal(t('Compare options'),'Compare options');
  assert.equal(sample('A day by the sea'),'A day by the sea');
});

test('Unrecognized user text is never machine-translated by phrase dictionary',()=>{
  setLocale('id');
  assert.equal(sample('My specific personal note'),'My specific personal note');
  assert.equal(t('User-authored option name'),'User-authored option name');
  assert.equal(translateMessage('Unrecognized explanation'),'Unrecognized explanation');
  setLocale('en');
});
