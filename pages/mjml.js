// import { useState, useRef } from 'react';
import {mjml2html} from 'mjml';
/*
  Compile an mjml string
*/
const htmlOutput = mjml2html(`
    <mjml>
      <mj-head>
        <!-- You can add MJML head components here if needed -->
      </mj-head>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              Hello World!
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);
  
  console.log(htmlOutput);