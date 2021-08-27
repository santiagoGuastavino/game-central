import './css/styles.css';

let CountItem = (props) => {
    return (
        <article className='count-item'>
            <p className='count-item-title'>{ props.title }</p>
            <p className='count-item-number'>{ props.number }</p>
        </article>
    )
};

export default CountItem;