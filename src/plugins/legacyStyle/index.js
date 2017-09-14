import React from 'react';

export default {
  styleConfig: {
    classNames: {
      Layout: 'griddle griddle-container',
    }
  },
  components: {
    Style: () => (
      <style type="text/css">
        {`
          .griddle-container{
            border:1px solid #DDD;
          }

          .griddle .top-section{
            clear:both;
            display:table;
            width:100%;
          }

          .griddle .griddle-filter{
            float:left;
            width:50%;
            text-align:left;
            color:#222;
            min-height:1px;
          }

          .griddle .griddle-settings-toggle{
            float:left;
            width:50%;
            text-align:right;
          }

          .griddle .griddle-settings{
            background-color:#FFF;
            border:1px solid #DDD;
            color:#222;
            padding:10px;
            margin-bottom:10px;
          }

          .griddle .griddle-settings .griddle-columns{
            clear:both;
            display:table;
            width:100%;
            border-bottom:1px solid #EDEDED;
            margin-bottom:10px;
          }

          .griddle .griddle-settings .griddle-column-selection{
            float:left;
            width:20%;
          }
          .griddle table{
            width:100%;table-layout:fixed;
          }

          .griddle th{
            background-color:#EDEDEF;
            border:0px;
            border-bottom:1px solid #DDD;
            color:#222;
            padding:5px;
          }

          .griddle td{
            padding:5px;
            background-color:#FFF;
            border-top-color:#DDD;
            color:#222;
          }

          .griddle .footer-container{
            padding:0px;
            background-color:#EDEDED;
            border:0px;
            color:#222;
          }

          .griddle .griddle-previous, .griddle .griddle-page, .griddle .griddle-next{
            float:left;
            width:33%;
            min-height:1px;
            margin-top:5px;
          }

          .griddle .griddle-page{
            text-align:center;
          }

          .griddle .griddle-next{
            text-align:right;
          }

        `}
      </style>
    ),
  }
};
