import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import components from '../../components';
import { rowMouseEnter, rowMouseLeave } from './actions';

export const RowContainer = compose(
    connect(
        state => {
            return {
                hoveredRowKey: state.get('hoveredRowKey', null)
            };
        },
        (dispatch, {griddleKey}) => bindActionCreators({
            focusIn: rowMouseEnter.bind(this, griddleKey),
            focusOut: rowMouseLeave
        }, dispatch)
    ),
    components.RowContainer
);

export const Row = ({Cell, griddleKey, columnIds, style, className, focusIn, focusOut, hoveredRowKey}) => (
    <tr
        key={griddleKey}
        style={style}
        className={className}
        onMouseEnter={focusIn}
        onMouseLeave={focusOut}
    >
        { columnIds && columnIds.map(c => (
            <Cell
                key={`${c}-${griddleKey}`}
                griddleKey={griddleKey}
                columnId={c}
                style={style}
                className={className}
                hoveredRowKey={hoveredRowKey}
            />
        ))}
    </tr>
);
