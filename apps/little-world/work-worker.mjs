// One model instance serves the three desks in turn.
let generator;
self.onmessage = async ({data:{brief}}) => {
  try {
    self.postMessage({stage:'loading',agent:'nova'});
    const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.3/dist/transformers.min.js');
    env.allowLocalModels=false;
    env.backends.onnx.wasm.numThreads=1;
    generator ??= await pipeline('text-generation','onnx-community/Qwen2.5-0.5B-Instruct',{
      revision:'22942cb7d7ba4cc81bb4673549ca4d4614469b5e',device:'wasm',dtype:'q4',
      progress_callback(event){
        if(event.status==='progress' && event.progress!==undefined)
          self.postMessage({stage:'loading',agent:'nova',detail:event.file+' · '+Math.floor(event.progress)+'%'});
      }
    });
    let handoff='';
    const steps=[
      ['nova','Scope','Extract the objective, audience and constraints from the brief. Flag missing information.'],
      ['byte','Work plan','Build a short actionable execution plan with concrete checks. Use the supplied brief and scope.'],
      ['miso','Draft','Produce the requested draft or deliverable itself, using the brief and plan. Label any assumptions.']
    ];
    for(const [agent,title,instruction] of steps){
      self.postMessage({stage:'working',agent,title});
      const messages=[{role:'system',content:instruction+' Answer in the language of the brief. Do not invent research, external actions, or measurements.'},{role:'user',content:brief+'\n\n'+handoff}];
      const result=await generator(messages,{max_new_tokens:agent==='miso'?420:180,do_sample:false});
      const output=result[0].generated_text.at(-1).content.trim();
      if(!output)throw Error('Empty model output');
      self.postMessage({stage:'result',agent,title,output});
      handoff+='\n'+title+'\n'+output;
    }
    self.postMessage({stage:'done'});
  } catch(error){self.postMessage({stage:'error',detail:error.message});}
};
